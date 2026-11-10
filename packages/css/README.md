# @nova-ui/css

Responsive CSS library for Nova UI: design tokens, a modern reset, layout primitives (container, 12-column grid,
Responsive CSS library for Nova UI: design tokens, primary/secondary/tertiary color palettes, a modern reset, layout primitives (container, 12-column grid,
auto grid, stack, cluster, sidebar, switcher, cover, reel, app shell), 1,300+ responsive utilities, 4,300+ Google
Material Symbols icon classes, CSS animations, CSS-only components and print styles. Mobile first, cascade-layered,
logical properties, dark mode, container queries.

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<link rel="stylesheet" href="/node_modules/@nova-ui/css/dist/nova.min.css">
<body class="nova-base">
```

```html
<!-- 1 column on phones, 2 from 640px, 4 from 1024px -->
<div class="nova-container nova-section">
  <div class="nova-d-grid nova-cols-1 nova-sm-cols-2 nova-lg-cols-4 nova-gap-4">...</div>
  <ul class="nova-grid-auto nova-grid-auto-md" role="list">...</ul>   <!-- no breakpoints needed -->
</div>
```

```html
<!-- Available in nova.css, or import @nova-ui/css/icons.css on its own. -->
<span class="nova-icon nova-icon-home" aria-hidden="true"></span>
<span class="nova-icon nova-icon-favorite nova-icon-filled nova-icon-lg" aria-hidden="true"></span>

<!-- Logical spacing utilities work in every direction and have responsive variants. -->
<div class="nova-p-4 nova-mt-3 nova-sm-px-6 nova-md-m-0">...</div>
<span class="nova-animate-spin" aria-hidden="true">...</span>
```

| Read | What |
| --- | --- |
| `GUIDELINES.md` | The full guide: principles, breakpoints, which layout tool to use, recipes, accessibility, theming |
| `docs/index.html` | The same as a live page with resizable demos (run `pnpm build` first so `dist/` exists) |
| `docs/icons.html` | Searchable visual catalog of all generated Material Symbols |

| Import | Size (gzip) |
| --- | --- |
| `nova.css` / `nova.min.css` | about 54.9 KB / 51.1 KB |
| `icons.css` (standalone icon classes) | about 37.1 KB |
| `nova.compat.css` (no cascade layers, for browsers older than 2022) | about 51.0 KB |
| `tokens` + `reset` + `typography` + `layout` + `components` | about 9 KB together |

Works alongside the web components: `nova.css` includes the same tokens, so you don't also need
`@nova-ui/core/styles.css`.

```bash
pnpm --filter @nova-ui/css icons:update  # downloads Google's font, license and icon catalog
pnpm --filter @nova-ui/css build          # generates utilities, bundles dist/
pnpm --filter @nova-ui/css test           # well-formed, minifier, compat, 46 contrast pairs, docs classes
pnpm --filter @nova-ui/css test:browser   # real Chromium layout tests (needs Playwright)
```
