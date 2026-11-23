# Tailwind CSS preset

The preset adds Nova colours, radii, shadows, fonts, durations and z-indexes to Tailwind. Each one is a CSS variable, so your Tailwind classes follow light, dark and brand themes automatically.

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

Import the Nova stylesheet too, so the variables exist:

```css
@import '@kvui/css/nova.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Classes

| Utility | Resolves to |
| --- | --- |
| `bg-nova-surface`, `bg-nova-sunken`, `bg-nova-raised` | Surface tokens |
| `text-nova-fg`, `text-nova-muted`, `text-nova-subtle` | Text tokens |
| `bg-nova-accent`, `text-nova-on-accent`, `bg-nova-accent-soft` | Accent tokens |
| `border-nova-border`, `border-nova-border-strong` | Border tokens |
| `text-nova-danger`, `bg-nova-success` and so on | Status colours |
| `rounded-nova-control`, `rounded-nova-surface`, `rounded-nova-pill` | Radius tokens |
| `shadow-nova-sm`, `shadow-nova-md`, `shadow-nova-lg` | Shadows |
| `font-nova-sans`, `font-nova-mono` | Font stacks |
| `duration-nova-fast`, `duration-nova-base` | Motion timings |
| `z-nova-dropdown`, `z-nova-modal`, `z-nova-toast` | Layers |

## Mixing with components

Nova web components keep their own styling inside their shadow root, so Tailwind classes apply to the elements around them, not inside. Use Tailwind for page layout and Nova components for controls.

## Dark mode

Set `darkMode` as you like, or leave Tailwind's default. Nova's tokens already switch with `data-theme`, so you don't need `dark:` variants for Nova colours.
