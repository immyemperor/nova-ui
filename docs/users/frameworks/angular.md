# Angular

Works with Angular 17 and later, using standalone components. Each Nova component is a standalone Angular component with inputs, outputs and forms integration.

## Install

```bash
pnpm add @omni/core @omni/css @omni/angular
```

Add the stylesheet to `angular.json`:

```json
"styles": ["node_modules/@omni/css/dist/nova.min.css", "src/styles.css"]
```

## Use components

```ts
import { Component, inject, signal } from '@angular/core';
import { UiButton, UiInput, UiCard, ThemeService, toast, confirm } from '@omni/angular';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [UiButton, UiInput, UiCard],
  template: `
    <ui-card variant="raised">
      <ui-input label="Email" [value]="email()" (uiInput)="email.set($event.detail)"></ui-input>
      <ui-button (click)="save()">Save</ui-button>
    </ui-card>
  `,
})
export class ProfileComponent {
  readonly theme = inject(ThemeService);
  readonly email = signal('');
  save() { toast.success('Saved'); }
}
```

## Forms

The form controls provide Angular value accessors, so `ngModel` and reactive forms work:

```html
<ui-input name="email" label="Email" [(ngModel)]="email" required></ui-input>
<ui-select name="owner" [(ngModel)]="owner" [options]="owners"></ui-select>
```

Use `[(ngModel)]` for two-way binding, or `[formControl]` with `ReactiveFormsModule`. The value accessors are generated from the component configuration in `stencil.config.ts`.

## Outputs

Events are outputs in the `ui*` form: `(uiChange)`, `(uiInput)`, `(uiSearch)`. The payload is in `$event.detail`.

## Theme service

`ThemeService` exposes `mode` and `resolved` as signals and `set(mode)` to change them.

## Exit animations

Angular has no built-in exit animation for removed content. Call `playExit(element)` from `@omni/angular` before you remove an element, or use the `phase` approach from [Motion](../features/motion.md).

## The rich text editor

```ts
import { UiEditor } from '@omni/angular/editor';
```

## Gotchas

- **`ui-*` elements not known**: import the standalone component, or add `CUSTOM_ELEMENTS_SCHEMA` only as a last resort.
- **Entry-point build**: the editor is a secondary entry point, so import it from `@omni/angular/editor`.
- **Playground**: `apps/playground-angular` shows a working setup. It has not yet been built in CI; see [Testing](../../humans/testing.md).
