# @nova-ui/core

Nova UI's framework-agnostic web components, theme helpers, icon registry, and motion utilities.

```sh
npm install @nova-ui/core
```

```ts
import '@nova-ui/core/styles.css';
import { defineCustomElements } from '@nova-ui/core/loader';

defineCustomElements();
```

```html
<ui-button variant="primary">
  <ui-icon slot="start" name="check"></ui-icon>
  Save
</ui-button>
```

Components are native custom elements and can be used without a framework. See the repository README for component
properties, events, framework bindings, theming, and the optional `@nova-ui/editor` package.