# Layout and CSS

`@kvui/css` provides layout primitives, responsive utilities, container queries, typography and CSS-only components. It's useful with or without the web components.

The complete guide, with breakpoints, a decision table ("which layout tool do I use?"), recipes and accessibility notes, is in **[packages/css/GUIDELINES.md](../../../packages/css/GUIDELINES.md)**. A live, resizable version is at `packages/css/docs/index.html`.

## The essentials

```html
<div class="nova-container nova-section nova-stack">
  <h1 class="nova-h2">Dashboard</h1>
  <div class="nova-grid-auto nova-grid-auto-md nova-gap-4">…</div>
  <div class="nova-cluster nova-cluster-between">…</div>
</div>
```

| Need | Class |
| --- | --- |
| Centred content with safe margins | `nova-container` (sizes: `-sm`, `-md`, `-lg`, `-prose`) |
| Vertical spacing | `nova-stack` (`nova-stack-sm`, `-lg`) |
| Wrapping row | `nova-cluster` |
| Cards that fill the space | `nova-grid-auto` (`nova-grid-auto-sm`, `-md`, `-lg`) |
| Fixed side and fluid main | `nova-sidebar` |
| Row that stacks below a width | `nova-switcher` |
| App frame | `nova-shell`, `nova-shell-sidebar`, `nova-shell-aside` |

## Responsive without thinking

Classes are mobile first. `nova-md-cols-3` means "three columns from 768px up". Visibility works the same way: `nova-hide-below-md`, `nova-hide-md-up`.

## Container queries

`nova-cq` on a parent makes its children respond to its width, not the screen: `nova-cq-md-cols-2`.

## Themes

Every colour in these classes is a token, so `nova-bg-surface` and `nova-text-muted` follow light and dark mode.

## Motion helpers

`nova-scroll-reveal` and `nova-scroll-progress` animate with the browser's scroll timeline. They are inert where unsupported, and disabled for reduced motion.

## Tailwind

If you use Tailwind, add the [preset](../frameworks/tailwind.md). Nova's layout classes and Tailwind's can sit side by side.
