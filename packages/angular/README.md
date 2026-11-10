# @nova-ui/angular

Standalone Angular component proxies and `ThemeService` for Nova UI.

```sh
npm install @nova-ui/angular @nova-ui/core @angular/common @angular/core rxjs tslib
```

```ts
import { Component } from '@angular/core';
import { UiButton, UiIcon } from '@nova-ui/angular';

@Component({
  standalone: true,
  imports: [UiButton, UiIcon],
  template: '<ui-button><ui-icon slot="start" name="check"></ui-icon>Save</ui-button>',
})
export class ExampleComponent {}
```

Add `node_modules/@nova-ui/core/dist/nova-ui/nova-ui.css` to the `styles` array in `angular.json`. The optional editor
proxies are exported from `@nova-ui/angular/editor` after installing `@nova-ui/editor`.