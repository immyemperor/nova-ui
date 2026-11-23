import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CATEGORIES } from './catalog';

@Component({
  selector: 'app-components-index',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="nova-stack nova-stack-sm" aria-labelledby="welcome">
      <h2 id="welcome" class="nova-h2">Component explorer</h2>
      <p class="nova-lead">
        Choose a component from the sidebar to see a live example, copyable source and its full API.
        {{ total }} components in {{ categories }} categories.
      </p>
    </section>
  `,
})
export class ComponentsIndexComponent {
  readonly total = CATEGORIES.reduce((n, c) => n + c.tags.length, 0);
  readonly categories = CATEGORIES.length;
}
