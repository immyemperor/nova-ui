# CSS-only usage

Use `@kvui/css` alone for static pages, server-rendered templates or email-to-web layouts where no JavaScript runs. You get layout, typography, utilities and CSS-only components (buttons, cards, badges, alerts, form fields, tables).

## Install and load

```bash
pnpm add @kvui/css
```

```html
<link rel="stylesheet" href="/node_modules/@kvui/css/dist/nova.min.css" />
<body class="nova-base">
  <main class="nova-container nova-section nova-stack">
    <h1 class="nova-h2">Pricing</h1>
    <div class="nova-grid-auto nova-grid-auto-md nova-gap-4">
      <article class="nova-card nova-card-raised">
        <div class="nova-card__body nova-stack nova-stack-sm">
          <h2 class="nova-h5">Team</h2>
          <button class="nova-btn">Choose</button>
        </div>
      </article>
    </div>
  </main>
</body>
```

## What you get

- Layout primitives: `nova-container`, `nova-page`, `nova-stack`, `nova-cluster`, `nova-grid-auto`, `nova-sidebar`, `nova-switcher`, `nova-shell`.
- Responsive utilities: `nova-md-cols-3`, `nova-hide-below-md`, `nova-md-px-8`.
- Container queries: `nova-cq` with `nova-cq-md-cols-2`.
- CSS-only components with the same look as the web components.
- Scroll-linked motion: `nova-scroll-reveal`, `nova-scroll-progress`.

The full guide, with breakpoints, recipes and accessibility notes, is in [packages/css/GUIDELINES.md](../../../packages/css/GUIDELINES.md). A live, resizable version is in `packages/css/docs/index.html`.

## Limits

CSS-only components can't open menus, validate forms or fetch data. When you need behaviour, use the web components instead; they match these visually.
