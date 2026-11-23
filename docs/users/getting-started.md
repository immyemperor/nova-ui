# Getting started

Nova UI is a design system with one set of components that works in plain HTML, React, Next.js, Vite, Angular and Vue, plus a CSS library and a Tailwind preset. This page gets you to a working screen in about five minutes. Pick your framework afterwards in [Frameworks](frameworks/README.md).

## 1. Install

Choose what you need. Most apps need only the first line.

```bash
pnpm add @kvui/core            # web components, tokens, theme, utilities
pnpm add @kvui/css             # layout classes, utilities, CSS-only components (optional)
pnpm add @kvui/react           # React wrappers (React, Next.js, Vite + React)
pnpm add @kvui/angular         # Angular standalone wrappers
pnpm add @kvui/vue             # Vue 3 wrappers
pnpm add @kvui/editor          # rich text editor (optional, heavy, built on Tiptap)
pnpm add -D @kvui/tailwind     # Tailwind preset (optional)
```

## 2. Add the stylesheet

Import one stylesheet once, near the top of your app. It contains the design tokens, the reset, layout classes and utilities.

```css
@import '@kvui/css/nova.css';
```

Also set the viewport so the layout respects phone notches and users can still zoom:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

Never add `user-scalable=no` or `maximum-scale=1`. It blocks zoom and fails WCAG.

If you want Google's Material Symbols instead of the built-in icons, add the font link from [Icons](features/icons.md) to your page's `<head>`. Skip it otherwise.

## 3. Use a component

Every framework uses the same component names and the same props. Only the syntax changes.

| Framework | Usage |
| --- | --- |
| HTML | `<ui-button variant="primary">Save</ui-button>` |
| React | `<UiButton variant="primary">Save</UiButton>` |
| Angular | `<ui-button variant="primary">Save</ui-button>` (standalone import `UiButton`) |
| Vue | `<UiButton variant="primary">Save</UiButton>` (from `@kvui/vue`) |

## 4. Respond to events

Events are named after the component and the action, prefixed with `ui`. In HTML they are DOM events; in React and Angular they're the same events in each framework's syntax.

| Framework | Listen to `uiChange` |
| --- | --- |
| HTML | `el.addEventListener('ui-change', (e) => e.detail)` |
| React | `<UiSelect onUiChange={(e) => e.detail} />` |
| Angular | `<ui-select (uiChange)="onChange($event.detail)" />` |
| Vue | `<UiSelect @ui-change="onChange" />` |

The `detail` carries the new value. Each component's reference lists its events and their payloads.

## 5. Turn on theming

Nova follows the operating-system light or dark setting by default. To let users choose, call `setThemeMode('light' | 'dark' | 'system')`, or drop in `<ui-theme-toggle>`. The choice is remembered. See [Theming](features/theming.md).

## 6. Where to go next

- [Releases](releases.md): what to install, how versions work, how to upgrade and roll back.

- [Concepts](concepts.md): how the pieces fit together, and the few rules that matter.
- [Your framework](frameworks/README.md): setup and gotchas for your stack.
- [Feature guides](features/README.md): forms, overlays, navigation, tables, charts, editor and more.
- [Component reference](../../packages/core/dist-docs/API.md): every component, prop, event, method and slot.
- [Troubleshooting](troubleshooting.md): when something doesn't render.
