import { Component, computed, inject, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { listIcons } from '@kvui/angular';
import { MATERIAL_NAMES } from './library-data';

const PAGE = 180;

/** Browse the Material Symbols set (font) or the Kvui set (SVG). Selecting an icon copies its markup. */
@Component({
  selector: 'app-icon-browser',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="kvui-stack kvui-stack-lg" aria-labelledby="icons-heading">
      <header class="kvui-stack kvui-stack-xs">
        <p class="kvui-caption">Icons</p>
        <h2 id="icons-heading" class="kvui-h2">{{ family() === 'material' ? 'Material Symbols' : 'Kvui icons' }}</h2>
        <p class="kvui-lead">
          @if (family() === 'material') {
            {{ materialCount() }} Google Material Symbols, drawn with the bundled font. Select an icon to copy its markup.
          } @else {
            {{ kvuiNames().length }} built-in SVG icons. Select an icon to copy its markup.
          }
        </p>
      </header>

      @if (family() === 'material' && materialCount() === 0) {
        <div class="kvui-alert kvui-alert-warning" role="status">
          <p class="kvui-alert__title">Material names not generated yet</p>
          Run <code>pnpm --filter &#64;kvui/css icons:update</code>, then <code>pnpm --filter &#64;kvui/css build</code>, and reload.
        </div>
      }

      <div class="kvui-cluster kvui-cluster-between">
        <div class="kvui-field" style="min-inline-size: 14rem; flex: 1 1 16rem">
          <label class="kvui-label" for="icon-search">Search by name</label>
          <input id="icon-search" class="kvui-input" type="search" placeholder="e.g. arrow, home, chart" autocomplete="off"
            [value]="query()" (input)="setQuery(valueOf($event))" />
        </div>
        <div class="kvui-cluster">
          @if (family() === 'material') {
            <label class="kvui-check kvui-small"><input type="checkbox" [checked]="filled()" (change)="filled.set(checkedOf($event))" /> Filled</label>
          }
          <label class="kvui-small">Size
            <select class="kvui-select" [value]="size()" (change)="size.set(valueOf($event))">
              <option value="1.25rem">Small</option>
              <option value="1.75rem">Medium</option>
              <option value="2.5rem">Large</option>
              <option value="3.5rem">XL</option>
            </select>
          </label>
        </div>
      </div>

      <p class="kvui-caption" role="status" aria-live="polite">
        {{ matches().length ? 'Showing ' + shown().length + ' of ' + matches().length : 'No icons match' }}
      </p>

      <ul class="kvui-grid-auto kvui-grid-auto-xs kvui-gap-2" role="list" aria-label="Icons">
        @for (n of shown(); track n) {
          <li>
            <button type="button" class="kvui-card kvui-p-3 kvui-stack kvui-stack-xs" style="width: 100%; align-items: center; cursor: pointer"
              [attr.aria-label]="'Copy ' + n" (click)="copy(n)">
              @if (family() === 'material') {
                <span class="kvui-icon" [class.kvui-icon-filled]="filled()" [class]="iconClass(n)" [style.font-size]="size()" aria-hidden="true"></span>
              } @else {
                <ui-icon [name]="n" [size]="size()"></ui-icon>
              }
              <span class="kvui-caption kvui-break-words">{{ copied() === n ? 'Copied' : n }}</span>
            </button>
          </li>
        }
      </ul>

      @if (limit() < matches().length) {
        <div class="kvui-cluster kvui-cluster-center">
          <button type="button" class="kvui-btn kvui-btn-secondary" (click)="showMore()">
            Show more ({{ matches().length - limit() }} left)
          </button>
        </div>
      }
    </section>
  `,
})
export class IconBrowserComponent {
  private readonly route = inject(ActivatedRoute);
  readonly family = toSignal(this.route.paramMap.pipe(map((p) => (p.get('family') === 'kvui' ? 'kvui' : 'material'))), { initialValue: 'material' as const });

  readonly PAGE = PAGE;
  readonly query = signal('');
  readonly limit = signal(PAGE);
  readonly filled = signal(false);
  readonly size = signal('1.75rem');
  readonly copied = signal<string | null>(null);

  readonly materialCount = computed(() => MATERIAL_NAMES.length);
  readonly kvuiNames = signal<string[]>(listIcons());
  readonly names = computed(() => (this.family() === 'material' ? [...MATERIAL_NAMES] : this.kvuiNames()));
  readonly matches = computed(() => {
    const q = this.query().trim().toLowerCase().replace(/-/g, '_');
    return q ? this.names().filter((n) => n.includes(q)) : this.names();
  });
  readonly shown = computed(() => this.matches().slice(0, this.limit()));

  iconClass(n: string): string {
    return `kvui-icon kvui-icon-${n.replaceAll('_', '-')}`;
  }

  showMore(): void {
    this.limit.update((l) => l + PAGE);
  }

  setQuery(value: string): void {
    this.query.set(value);
    this.limit.set(PAGE);
  }

  valueOf(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement).value;
  }

  checkedOf(event: Event): boolean {
    return (event.target as HTMLInputElement).checked;
  }

  async copy(n: string): Promise<void> {
    const snippet = this.family() === 'material'
      ? `<span class="kvui-icon kvui-icon-${n.replaceAll('_', '-')}${this.filled() ? ' kvui-icon-filled' : ''}" aria-hidden="true"></span>`
      : `<ui-icon name="${n}"></ui-icon>`;
    try {
      await navigator.clipboard.writeText(snippet);
    } catch {
      /* clipboard blocked: nothing to copy to */
    }
    this.copied.set(n);
    setTimeout(() => this.copied.set(null), 1400);
  }
}
