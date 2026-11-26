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
    <a class="kvui-skip-link" href="#main">Skip to content</a>
    <div class="kvui-shell kvui-shell-sidebar kvui-shell-sticky-side">
      <header class="kvui-shell__header kvui-sticky-top kvui-z-20 kvui-bg-surface kvui-border-b">
        <div class="kvui-cluster kvui-cluster-between kvui-px-4 kvui-py-3">
          <div class="kvui-cluster">
            <a class="kvui-link" routerLink="/">Demos</a>
            <strong>Kvui UI on Angular</strong>
          </div>
          <div class="kvui-cluster">
            <a class="kvui-btn kvui-btn-ghost kvui-btn-sm" routerLink="/components">Components</a>
            <a class="kvui-btn kvui-btn-ghost kvui-btn-sm" routerLink="/icons/material">Icons</a>
          </div>
        </div>
      </header>
      <nav class="kvui-shell__sidebar kvui-hide-below-md kvui-p-4 kvui-border-e" aria-label="Component explorer">
        <app-explorer-nav />
      </nav>
      <main class="kvui-shell__main kvui-p-4 kvui-md-p-6" id="main">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppComponent {}
