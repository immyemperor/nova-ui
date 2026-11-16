# Vite

Vite works with React, Vue, Angular or plain JavaScript. Use the framework guide for the component layer, and this page for the build.

## Create a project

```bash
pnpm create vite my-app --template react-ts   # or vue-ts, vanilla-ts
cd my-app
pnpm add @nova-ui/core @nova-ui/css @nova-ui/react
```

## Entry file

```tsx
// src/main.tsx
import '@nova-ui/css/nova.css';
import { createRoot } from 'react-dom/client';
import { App } from './App';

createRoot(document.getElementById('root')!).render(<App />);
```

Vue and plain JavaScript work the same way: import the stylesheet first, then mount the app.

## Dark mode before first paint

Add the theme script to `index.html` before your scripts:

```html
<script>
  document.documentElement.dataset.theme =
    localStorage.getItem('nova-ui-theme') ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
</script>
```

## Splitting the editor

The rich text editor is large. Import it from its own entry point so Vite puts it in a separate chunk:

```tsx
const { UiEditor } = await import('@nova-ui/react/editor');
```

## Workspace development

If you're developing Nova and an app together in one monorepo, depend on the packages with `workspace:*` so changes appear without publishing.
