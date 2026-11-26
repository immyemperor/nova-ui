# Tailwind CSS preset

The preset adds Kvui colours, radii, shadows, fonts, durations and z-indexes to Tailwind. Each one is a CSS variable, so your Tailwind classes follow light, dark and brand themes automatically.

## Install

```bash
pnpm add -D @kvui/tailwind tailwindcss
```

## Configure

```js
// tailwind.config.js
module.exports = {
  presets: [require('@kvui/tailwind')],
  content: ['./src/**/*.{html,tsx,vue,ts}'],
};
```

Import the Kvui stylesheet too, so the variables exist:

```css
@import '@kvui/css/kvui.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Classes

| Utility | Resolves to |
| --- | --- |
| `bg-kvui-surface`, `bg-kvui-sunken`, `bg-kvui-raised` | Surface tokens |
| `text-kvui-fg`, `text-kvui-muted`, `text-kvui-subtle` | Text tokens |
| `bg-kvui-accent`, `text-kvui-on-accent`, `bg-kvui-accent-soft` | Accent tokens |
| `border-kvui-border`, `border-kvui-border-strong` | Border tokens |
| `text-kvui-danger`, `bg-kvui-success` and so on | Status colours |
| `rounded-kvui-control`, `rounded-kvui-surface`, `rounded-kvui-pill` | Radius tokens |
| `shadow-kvui-sm`, `shadow-kvui-md`, `shadow-kvui-lg` | Shadows |
| `font-kvui-sans`, `font-kvui-mono` | Font stacks |
| `duration-kvui-fast`, `duration-kvui-base` | Motion timings |
| `z-kvui-dropdown`, `z-kvui-modal`, `z-kvui-toast` | Layers |

## Mixing with components

Kvui web components keep their own styling inside their shadow root, so Tailwind classes apply to the elements around them, not inside. Use Tailwind for page layout and Kvui components for controls.

## Dark mode

Set `darkMode` as you like, or leave Tailwind's default. Kvui's tokens already switch with `data-theme`, so you don't need `dark:` variants for Kvui colours.
