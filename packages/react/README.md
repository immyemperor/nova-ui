# @nova-ui/react

React bindings for Nova UI web components, including `useTheme()` and a server-safe theme initialization script.

```sh
npm install @nova-ui/react @nova-ui/core react react-dom
```

```tsx
import '@nova-ui/core/styles.css';
import { UiButton, UiIcon } from '@nova-ui/react';

export function SaveButton() {
  return <UiButton variant="primary"><UiIcon slot="start" name="check" />Save</UiButton>;
}
```

For Next.js App Router, import `themeInitScript` from `@nova-ui/react/server` in the root layout. The optional editor
bindings are available from `@nova-ui/react/editor` after installing `@nova-ui/editor`.