# Theming

Kvui has a light and a dark theme, and you can change any colour, radius, shadow, font or timing with CSS variables.

## Light, dark and system

```js
import { setThemeMode, getThemeMode, onThemeChange } from '@kvui/core';

setThemeMode('dark');         // 'light' | 'dark' | 'system'
onThemeChange((mode, resolved) => console.log(mode, resolved));
```

Or drop in `<ui-theme-toggle>`, a button that cycles light, dark and system. The choice is saved in `localStorage` under `kvui-theme` and applied before first paint if you add the theme script (see [Next.js](../frameworks/nextjs.md) and [Vite](../frameworks/vite.md)).

The page gets `data-theme="light"` or `"dark"` on `<html>`. Kvui's tokens switch with it.

## Brand colours

Generate a complete palette from one colour. The generator guarantees that text on the accent and the accent on the surface meet WCAG AA (4.5:1) in both themes:

```ts
import { generateTheme, themeToCSS } from '@kvui/core';

const theme = generateTheme('#7c3aed');
console.log(theme.warnings);            // [] when every pair passes
document.head.insertAdjacentHTML('beforeend', `<style>${themeToCSS(theme)}</style>`);
```

Use `theme.light` and `theme.dark` to drive your own tokens.

## Override tokens

```css
:root {
  --kvui-color-accent: #5b3fd1;
  --kvui-color-accent-hover: #4a32b0;
  --kvui-radius-control: 10px;
}
[data-theme='dark'] {
  --kvui-color-accent: #a99bff;
}
```

Overrides apply to every component and every framework. Keep them in one stylesheet.

## Token reference

| Group | Examples |
| --- | --- |
| Surfaces | `--kvui-color-bg`, `--kvui-color-surface`, `--kvui-color-surface-raised`, `--kvui-color-surface-sunken` |
| Text | `--kvui-color-fg`, `--kvui-color-fg-muted`, `--kvui-color-fg-subtle`, `--kvui-color-fg-on-accent` |
| Accent | `--kvui-color-accent`, `--kvui-color-accent-hover`, `--kvui-color-accent-soft` |
| Status | `--kvui-color-success`, `--kvui-color-warning`, `--kvui-color-danger`, `--kvui-color-info` (and `-soft`) |
| Shape | `--kvui-radius-control`, `--kvui-radius-surface`, `--kvui-radius-pill` |
| Elevation | `--kvui-shadow-sm`, `--kvui-shadow-md`, `--kvui-shadow-lg`, `--kvui-focus-ring` |
| Type | `--kvui-font-sans`, `--kvui-font-mono`, `--kvui-text-xs` to `--kvui-text-5xl` |
| Space | `--kvui-space-1` to `--kvui-space-16`, `--kvui-space-fluid-s` to `-xl` |
| Motion | `--kvui-duration-fast`, `--kvui-duration-base`, `--kvui-ease-standard` |

## Translucent tints

Hover, selection, drop-target and scrim colours are translucent, so they sit on whatever the surface is and never hide it. The tokens:

| Token | Used for |
| --- | --- |
| `--kvui-tint-hover` | Hover backgrounds on rows, buttons, menu items and tabs |
| `--kvui-tint-accent` | Selected rows, active sidebar items, selected tree nodes, option highlights |
| `--kvui-tint-accent-strong` | Pressed states and drop targets |
| `--kvui-tint-danger`, `-success`, `-warning`, `-info` | Status tints for your own panels |
| `--kvui-scrim` | Dialog backdrops |

Text is never placed directly on a tint without a check. The build blends each tint onto its surface and tests the text against it, so accent text on a selected row uses `--kvui-color-accent-hover`, which keeps AA contrast.

Override a tint to change how strong a state looks:

```css
:root { --kvui-tint-accent: rgb(91 63 209 / 0.14); }
[data-theme='dark'] { --kvui-tint-accent: rgb(169 155 255 / 0.18); }
```

## Contrast

Built-in colour pairs are checked against WCAG AA in both themes on every build. If you add colours, check them with `contrastRatio` from `@kvui/core`.
