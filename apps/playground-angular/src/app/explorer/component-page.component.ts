import { Component, computed, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ApiTableComponent } from './api-table.component';
import type { ManifestDeclaration } from './api-table.component';
import { ANGULAR_EXAMPLES } from './examples';
import { ANGULAR_EXAMPLE_SOURCES, DECLARATIONS } from './library-data';
import { CATEGORIES } from './catalog';
import { CodeBlockComponent } from '../code-block.component';

/** One component: its live example (when there is one), copyable source and its full API. */
@Component({
  selector: 'app-component-page',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [ApiTableComponent, CodeBlockComponent, NgComponentOutlet, RouterLink],
  template: `
    @if (decl(); as d) {
      <article class="kvui-stack kvui-stack-lg" aria-labelledby="component-title">
        <header class="kvui-stack kvui-stack-xs">
          <p class="kvui-caption">{{ category() }}</p>
          <h2 id="component-title" class="kvui-h2"><code>&lt;{{ d.tagName }}&gt;</code></h2>
          @if (d.description) { <p class="kvui-lead">{{ d.description }}</p> }
        </header>

        <section class="kvui-stack kvui-stack-sm" aria-labelledby="example-heading">
          <h3 id="example-heading" class="kvui-h4">Example</h3>
          @if (example(); as ex) {
            <div class="kvui-card kvui-card-raised kvui-p-5">
              <ng-container *ngComponentOutlet="ex" />
            </div>
            <app-code-block [title]="tag() + ' example'" [code]="source()" />
          } @else {
            <p class="kvui-caption">No live example for this component yet. Its properties, events and methods are below.</p>
          }
        </section>

        <section class="kvui-stack kvui-stack-sm" aria-labelledby="api-heading">
          <h3 id="api-heading" class="kvui-h4">API</h3>
          <app-api-table [decl]="d" />
        </section>
      </article>
    } @else {
      <div class="kvui-stack">
        <h2 class="kvui-h3">Unknown component</h2>
        <p>No component is called <code>{{ tag() }}</code>. <a routerLink="/components">Choose one from the list.</a></p>
      </div>
    }
  `,
})
export class ComponentPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly tag = toSignal(this.route.paramMap.pipe(map((p) => p.get('tag') ?? '')), { initialValue: '' });

  readonly decl = computed(() => (DECLARATIONS as ManifestDeclaration[]).find((d) => d.tagName === this.tag()));
  readonly example = computed(() => ANGULAR_EXAMPLES[this.tag()]);
  readonly source = computed(() => ANGULAR_EXAMPLE_SOURCES[this.tag()] ?? '');
  readonly category = computed(() => CATEGORIES.find((c) => c.tags.includes(this.tag()))?.label ?? '');
}
