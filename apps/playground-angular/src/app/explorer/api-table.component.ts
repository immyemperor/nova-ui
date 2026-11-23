import { Component, input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/** The parts of the component manifest the explorer shows. */
export interface ManifestDeclaration {
  tagName: string;
  name: string;
  description?: string;
  attributes: { name: string; type: { text: string }; default?: string; description?: string }[];
  events: { name: string; type: { text: string }; description?: string }[];
  methods: { name: string; parameters?: string; description?: string }[];
  slots: { name: string }[];
}

/** Properties, events, methods and slots for one component. */
@Component({
  selector: 'app-api-table',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="nova-stack nova-stack-lg">
      <div class="nova-stack nova-stack-xs">
        <h4 class="nova-h6">Properties ({{ decl().attributes.length }})</h4>
        @if (decl().attributes.length) {
          <div class="nova-table-wrap">
            <table class="nova-table">
              <thead><tr><th>Attribute</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                @for (p of decl().attributes; track p.name) {
                  <tr>
                    <td><code>{{ p.name }}</code></td>
                    <td><code>{{ p.type.text }}</code></td>
                    <td>@if (p.default) { <code>{{ p.default }}</code> }</td>
                    <td>{{ p.description ?? '' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <p class="nova-caption">No properties.</p>
        }
      </div>

      <div class="nova-stack nova-stack-xs">
        <h4 class="nova-h6">Events ({{ decl().events.length }})</h4>
        @if (decl().events.length) {
          <ul class="nova-stack nova-stack-xs nova-small" role="list">
            @for (e of decl().events; track e.name) {
              <li><code>{{ e.name }}</code> <span class="nova-text-muted">detail: <code>{{ e.type.text }}</code></span> {{ e.description ?? '' }}</li>
            }
          </ul>
        } @else {
          <p class="nova-caption">This component emits no events.</p>
        }
      </div>

      <div class="nova-stack nova-stack-xs">
        <h4 class="nova-h6">Methods ({{ decl().methods.length }})</h4>
        @if (decl().methods.length) {
          <ul class="nova-stack nova-stack-xs nova-small" role="list">
            @for (m of decl().methods; track m.name) {
              <li><code>{{ m.name }}({{ m.parameters ?? '' }})</code> {{ m.description ?? '' }}</li>
            }
          </ul>
        } @else {
          <p class="nova-caption">No methods.</p>
        }
      </div>

      <div class="nova-stack nova-stack-xs">
        <h4 class="nova-h6">Slots ({{ decl().slots.length }})</h4>
        @if (decl().slots.length) {
          <ul class="nova-cluster nova-small" role="list">
            @for (s of decl().slots; track s.name) {
              <li><code>{{ s.name || 'default' }}</code></li>
            }
          </ul>
        } @else {
          <p class="nova-caption">No named slots. Content goes in the default slot.</p>
        }
      </div>
    </div>
  `,
})
export class ApiTableComponent {
  readonly decl = input.required<ManifestDeclaration>();
}
