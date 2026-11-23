import { Component, signal, computed, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CATEGORIES } from './catalog';

/** Sidebar: every component grouped by category, with search and icon-set links. */
@Component({
  selector: 'app-explorer-nav',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="explorer">
      <div class="nova-field nova-mb-3">
        <label class="nova-sr-only" for="explorer-search">Find a component</label>
        <input id="explorer-search" class="nova-input" type="search" placeholder="Find a component" autocomplete="off"
          [value]="query()" (input)="query.set(valueOf($event))" />
      </div>
      <ul class="explorer__list" role="list">
        <li><a class="explorer__link" routerLink="/components" routerLinkActive="is-current" [routerLinkActiveOptions]="{ exact: true }">All components</a></li>
        <li><a class="explorer__link" routerLink="/icons/material" routerLinkActive="is-current">Icons: Material</a></li>
        <li><a class="explorer__link" routerLink="/icons/nova" routerLinkActive="is-current">Icons: Nova</a></li>
      </ul>
      @for (c of visible(); track c.id) {
        <details class="explorer__group" [open]="!!query() || c.tags.length > 0">
          <summary>{{ c.label }} <span class="nova-caption">({{ c.tags.length }})</span></summary>
          <ul class="explorer__list" role="list">
            @for (t of c.tags; track t) {
              <li><a class="explorer__link" [routerLink]="['/components', t]" routerLinkActive="is-current"><code>{{ t }}</code></a></li>
            }
          </ul>
        </details>
      } @empty {
        <p class="nova-caption">No component matches.</p>
      }
    </div>
  `,
})
export class ExplorerNavComponent {
  readonly query = signal('');
  readonly visible = computed(() => {
    const q = this.query().trim().toLowerCase();
    return CATEGORIES
      .map((c) => ({ ...c, tags: c.tags.filter((t) => !q || t.includes(q) || c.label.toLowerCase().includes(q)) }))
      .filter((c) => c.tags.length > 0);
  });

  valueOf(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
}
