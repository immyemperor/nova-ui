# Theming

Nova has a light and a dark theme, and you can change any colour, radius, shadow, font or timing with CSS variables.

## Light, dark and system

```js
import { setThemeMode, getThemeMode, onThemeChange } from '@nova-ui/core';

setThemeMode('dark');         // 'light' | 'dark' | 'system'
onThemeChange((mode, resolved) => console.log(mode, resolved));
```

Or drop in `<ui-theme-toggle>`, a button that cycles light, dark and system. The choice is saved in `localStorage` under `nova-ui-theme` and applied before first paint if you add the theme script (see [Next.js](../frameworks/nextjs.md) and [Vite](../frameworks/vite.md)).

The page gets `data-theme="light"` or `"dark"` on `<html>`. Nova's tokens switch with it.

## Brand colours

Generate a complete palette from one colour. The generator guarantees that text on the accent and the accent on the surface meet WCAG AA (4.5:1) in both themes:

```ts
import { generateTheme, themeToCSS } from '@nova-ui/core';

const theme = generateTheme('#7c3aed');
console.log(theme.warnings);            // [] when every pair passes
document.head.insertAdjacentHTML('beforeend', `<style>${themeToCSS(theme)}</style>`);
```

Use `theme.light` and `theme.dark` to drive your own tokens.

## Override tokens

```css
:root {
  --nova-color-accent: #5b3fd1;
  --nova-color-accent-hover: #4a32b0;
  --nova-radius-control: 10px;
}
[data-theme='dark'] {
  --nova-color-accent: #a99bff;
}
```

Overrides apply to every component and every framework. Keep them in one stylesheet.

## Token reference

| Group | Examples |
| --- | --- |
| Surfaces | `--nova-color-bg`, `--nova-color-surface`, `--nova-color-surface-raised`, `--nova-color-surface-sunken` |
| Text | `--nova-color-fg`, `--nova-color-fg-muted`, `--nova-color-fg-subtle`, `--nova-color-fg-on-accent` |
| Accent | `--nova-color-accent`, `--nova-color-accent-hover`, `--nova-color-accent-soft` |
| Status | `--nova-color-success`, `--nova-color-warning`, `--nova-color-danger`, `--nova-color-info` (and `-soft`) |
| Shape | `--nova-radius-control`, `--nova-radius-surface`, `--nova-radius-pill` |
| Elevation | `--nova-shadow-sm`, `--nova-shadow-md`, `--nova-shadow-lg`, `--nova-focus-ring` |
| Type | `--nova-font-sans`, `--nova-font-mono`, `--nova-text-xs` to `--nova-text-5xl` |
| Space | `--nova-space-1` to `--nova-space-16`, `--nova-space-fluid-s` to `-xl` |
| Motion | `--nova-duration-fast`, `--nova-duration-base`, `--nova-ease-standard` |

## Translucent tints

Hover, selection, drop-target and scrim colours are translucent, so they sit on whatever the surface is and never hide it. The tokens:

| Token | Used for |
| --- | --- |
| `--nova-tint-hover` | Hover backgrounds on rows, buttons, menu items and tabs |
| `--nova-tint-accent` | Selected rows, active sidebar items, selected tree nodes, option highlights |
| `--nova-tint-accent-strong` | Pressed states and drop targets |
| `--nova-tint-danger`, `-success`, `-warning`, `-info` | Status tints for your own panels |
| `--nova-scrim` | Dialog backdrops |

Text is never placed directly on a tint without a check. The build blends each tint onto its surface and tests the text against it, so accent text on a selected row uses `--nova-color-accent-hover`, which keeps AA contrast.

Override a tint to change how strong a state looks:

```css
:root { --nova-tint-accent: rgb(91 63 209 / 0.14); }
[data-theme='dark'] { --nova-tint-accent: rgb(169 155 255 / 0.18); }
```

## Contrast

Built-in colour pairs are checked against WCAG AA in both themes on every build. If you add colours, check them with `contrastRatio` from `@nova-ui/core`.
