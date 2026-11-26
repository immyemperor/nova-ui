# @kvui/css

Responsive CSS library for Kvui UI: design tokens, a modern reset, layout primitives (container, 12-column grid,
auto grid, stack, cluster, sidebar, switcher, cover, reel, app shell), about 1,300 responsive utilities, CSS-only
components and print styles. Mobile first, cascade-layered, logical properties, dark mode, container queries.

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<link rel="stylesheet" href="/node_modules/@kvui/css/dist/kvui.min.css">
<body class="kvui-base">
```

```html
<!-- 1 column on phones, 2 from 640px, 4 from 1024px -->
<div class="kvui-container kvui-section">
  <div class="kvui-d-grid kvui-cols-1 kvui-sm-cols-2 kvui-lg-cols-4 kvui-gap-4">...</div>
  <ul class="kvui-grid-auto kvui-grid-auto-md" role="list">...</ul>   <!-- no breakpoints needed -->
</div>
```

| Read | What |
| --- | --- |
| `GUIDELINES.md` | The full guide: principles, breakpoints, which layout tool to use, recipes, accessibility, theming |
| `docs/index.html` | The same as a live page with resizable demos (run `pnpm build` first so `dist/` exists) |

| Import | Size (gzip) |
| --- | --- |
| `kvui.css` / `kvui.min.css` | 17.0 KB / 12.9 KB |
| `kvui.compat.css` (no cascade layers, for browsers older than 2022) | 12.8 KB |
| `tokens` + `reset` + `typography` + `layout` + `components` | about 9 KB together |

Works alongside the web components: `kvui.css` includes the same tokens, so you don't also need
`@kvui/core/styles.css`.

```bash
pnpm --filter @kvui/css build          # generates utilities, bundles dist/
pnpm --filter @kvui/css test           # well-formed, minifier, compat, 46 contrast pairs, docs classes
pnpm --filter @kvui/css test:browser   # real Chromium layout tests (needs Playwright)
```
