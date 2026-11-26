# Layout and CSS

`@kvui/css` provides layout primitives, responsive utilities, container queries, typography and CSS-only components. It's useful with or without the web components.

The complete guide, with breakpoints, a decision table ("which layout tool do I use?"), recipes and accessibility notes, is in **[packages/css/GUIDELINES.md](../../../packages/css/GUIDELINES.md)**. A live, resizable version is at `packages/css/docs/index.html`.

## The essentials

```html
<div class="kvui-container kvui-section kvui-stack">
  <h1 class="kvui-h2">Dashboard</h1>
  <div class="kvui-grid-auto kvui-grid-auto-md kvui-gap-4">…</div>
  <div class="kvui-cluster kvui-cluster-between">…</div>
</div>
```

| Need | Class |
| --- | --- |
| Centred content with safe margins | `kvui-container` (sizes: `-sm`, `-md`, `-lg`, `-prose`) |
| Vertical spacing | `kvui-stack` (`kvui-stack-sm`, `-lg`) |
| Wrapping row | `kvui-cluster` |
| Cards that fill the space | `kvui-grid-auto` (`kvui-grid-auto-sm`, `-md`, `-lg`) |
| Fixed side and fluid main | `kvui-sidebar` |
| Row that stacks below a width | `kvui-switcher` |
| App frame | `kvui-shell`, `kvui-shell-sidebar`, `kvui-shell-aside` |

## Responsive without thinking

Classes are mobile first. `kvui-md-cols-3` means "three columns from 768px up". Visibility works the same way: `kvui-hide-below-md`, `kvui-hide-md-up`.

## Container queries

`kvui-cq` on a parent makes its children respond to its width, not the screen: `kvui-cq-md-cols-2`.

## Themes

Every colour in these classes is a token, so `kvui-bg-surface` and `kvui-text-muted` follow light and dark mode.

## Motion helpers

`kvui-scroll-reveal` and `kvui-scroll-progress` animate with the browser's scroll timeline. They are inert where unsupported, and disabled for reduced motion.

## Tailwind

If you use Tailwind, add the [preset](../frameworks/tailwind.md). Kvui's layout classes and Tailwind's can sit side by side.
