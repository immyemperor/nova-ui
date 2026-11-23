import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ExplorerNavComponent } from './explorer/explorer-nav.component';

/** Shell: header, the component explorer sidebar, and the routed page. */
@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [RouterOutlet, RouterLink, ExplorerNavComponent],
  template: `
    <a class="nova-skip-link" href="#main">Skip to content</a>
    <div class="nova-shell nova-shell-sidebar nova-shell-sticky-side">
      <header class="nova-shell__header nova-sticky-top nova-z-20 nova-bg-surface nova-border-b">
        <div class="nova-cluster nova-cluster-between nova-px-4 nova-py-3">
          <div class="nova-cluster">
            <a class="nova-link" routerLink="/">Demos</a>
            <strong>Nova UI on Angular</strong>
          </div>
          <div class="nova-cluster">
            <a class="nova-btn nova-btn-ghost nova-btn-sm" routerLink="/components">Components</a>
            <a class="nova-btn nova-btn-ghost nova-btn-sm" routerLink="/icons/material">Icons</a>
          </div>
        </div>
      </header>
      <nav class="nova-shell__sidebar nova-hide-below-md nova-p-4 nova-border-e" aria-label="Component explorer">
        <app-explorer-nav />
      </nav>
      <main class="nova-shell__main nova-p-4 nova-md-p-6" id="main">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppComponent {}
