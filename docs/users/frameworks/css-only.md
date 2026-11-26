# CSS-only usage

Use `@kvui/css` alone for static pages, server-rendered templates or email-to-web layouts where no JavaScript runs. You get layout, typography, utilities and CSS-only components (buttons, cards, badges, alerts, form fields, tables).

## Install and load

```bash
pnpm add @kvui/css
```

```html
<link rel="stylesheet" href="/node_modules/@kvui/css/dist/kvui.min.css" />
<body class="kvui-base">
  <main class="kvui-container kvui-section kvui-stack">
    <h1 class="kvui-h2">Pricing</h1>
    <div class="kvui-grid-auto kvui-grid-auto-md kvui-gap-4">
      <article class="kvui-card kvui-card-raised">
        <div class="kvui-card__body kvui-stack kvui-stack-sm">
          <h2 class="kvui-h5">Team</h2>
          <button class="kvui-btn">Choose</button>
        </div>
      </article>
    </div>
  </main>
</body>
```

## What you get

- Layout primitives: `kvui-container`, `kvui-page`, `kvui-stack`, `kvui-cluster`, `kvui-grid-auto`, `kvui-sidebar`, `kvui-switcher`, `kvui-shell`.
- Responsive utilities: `kvui-md-cols-3`, `kvui-hide-below-md`, `kvui-md-px-8`.
- Container queries: `kvui-cq` with `kvui-cq-md-cols-2`.
- CSS-only components with the same look as the web components.
- Scroll-linked motion: `kvui-scroll-reveal`, `kvui-scroll-progress`.

The full guide, with breakpoints, recipes and accessibility notes, is in [packages/css/GUIDELINES.md](../../../packages/css/GUIDELINES.md). A live, resizable version is in `packages/css/docs/index.html`.

## Limits

CSS-only components can't open menus, validate forms or fetch data. When you need behaviour, use the web components instead; they match these visually.
