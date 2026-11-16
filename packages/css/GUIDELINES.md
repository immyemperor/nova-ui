# Nova CSS guidelines

How to build layouts that work on every screen, from a 320px phone to a 4K monitor, with `@nova-ui/css`.
Open `docs/index.html` for the same material with live, resizable examples.

- [1. Principles](#1-principles)
- [2. Getting started](#2-getting-started)
- [3. Screen sizes](#3-screen-sizes)
- [4. Which layout tool do I use?](#4-which-layout-tool-do-i-use)
- [5. Containers and gutters](#5-containers-and-gutters)
- [6. Grids](#6-grids)
- [7. Spacing](#7-spacing)
- [8. Typography](#8-typography)
- [9. Recipes](#9-recipes)
- [10. Container queries](#10-container-queries)
- [11. Utilities](#11-utilities)
- [12. Accessibility](#12-accessibility)
- [13. Theming and dark mode](#13-theming-and-dark-mode)
- [14. Overriding and layers](#14-overriding-and-layers)
- [15. Right-to-left, print, performance](#15-right-to-left-print-performance)
- [16. Browser support](#16-browser-support)
- [17. Conventions](#17-conventions)

---

## 1. Principles

1. **Mobile first.** Write the small-screen layout as the default and add `nova-md-*` / `nova-lg-*` classes only
   where more room lets you do something better. Every breakpoint is `min-width`.
2. **Intrinsic before breakpoints.** Most layouts don't need a breakpoint at all. `nova-grid-auto`, `nova-sidebar`
   and `nova-switcher` reflow based on the space they're given, which also makes them correct inside a narrow
   column, a modal or a split view where the *screen* is wide but the *space* isn't.
3. **Components respond to their container, pages respond to the viewport.** Use media-query utilities for
   page structure. Use container queries (`nova-cq`) for cards and widgets that appear in many places.
4. **Tokens, not magic numbers.** Spacing, colour, radius and type all come from `--nova-*` custom properties.
   Change a token once and the whole product follows, including dark mode.
5. **Logical properties.** Everything uses `inline`/`block`/`start`/`end` instead of `left`/`right`/`top`/`bottom`,
   so right-to-left languages work without extra CSS.
6. **Content decides the breakpoint.** If a layout breaks at 870px, fix it at 870px. The breakpoints below are
   defaults, not device targets.
7. **Accessible by default.** Visible focus, reduced-motion support, 44px touch targets on touch screens,
   reflow without horizontal scrolling at 320px and at 400% zoom.

## 2. Getting started

```bash
pnpm add @nova-ui/css
```

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <!-- viewport-fit=cover lets the container's safe-area padding keep content clear of notches. -->
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <link rel="stylesheet" href="/node_modules/@nova-ui/css/dist/nova.min.css" />
  </head>
  <body class="nova-base">
    <a class="nova-skip-link" href="#main">Skip to content</a>
    <header class="nova-container nova-py-4">...</header>
    <main id="main" class="nova-container nova-section">...</main>
  </body>
</html>
```

In a bundler: `import '@nova-ui/css';` (resolves to `dist/nova.css`).

**Never** add `maximum-scale=1` or `user-scalable=no` to the viewport tag. It blocks pinch zoom and fails WCAG 1.4.4.

**Pick what you need.** `nova.css` contains everything (96 KB, 17 KB gzipped; 12.9 KB minified and gzipped). To ship less,
import modules separately. `tokens.css` is required by the others.

| File | Contains |
| --- | --- |
| `tokens.css` | Colour, type, space, radius, shadow, motion and layout tokens; light and dark themes |
| `reset.css` | A small modern reset |
| `typography.css` | `.nova-base`, heading scale, `.nova-prose`, type classes |
| `layout.css` | Container, page, grid, stack, cluster, sidebar, switcher, cover, reel, shell and more |
| `components.css` | CSS-only button, card, badge, alert, form fields, table |
| `utilities.css` | About 1,300 single-purpose classes, plus print helpers |
| `nova.min.css` | Everything, minified |
| `nova.compat.css` | Everything, without cascade layers (see [section 16](#16-browser-support)) |

Using the web components too? `nova.css` already includes the same tokens, so you don't also need
`@nova-ui/core/styles.css`.

## 3. Screen sizes

| Name | Starts at | Typical devices | Typical layout change |
| --- | --- | --- | --- |
| *(base)* | 0 | Phones, portrait | One column. Stacked everything. Full-width buttons are fine |
| `sm` | `40em` (640px) | Large phones, landscape | 2-up cards, side-by-side form fields |
| `md` | `48em` (768px) | Tablets | Sidebar becomes a column, 2-3 column grids, inline navigation |
| `lg` | `64em` (1024px) | Small laptops, tablets landscape | 3-4 column grids, denser tables |
| `xl` | `80em` (1280px) | Desktops | Optional third column (the shell's aside) |
| `2xl` | `96em` (1536px) | Large desktops | Wider containers, more whitespace. Rarely needed |

Breakpoints are in `em`, so they follow the user's browser font-size: someone who sets 20px text gets the tablet
layout sooner, which is what they need.

**Test at these widths**: 320, 360, 390, 768, 1024, 1280, 1536 and 1920px; phones in landscape; browser zoom at 200% and
400%; and "text only" zoom. Test with a real touch device before shipping.

**Naming.** `nova-{utility}` applies at every size. `nova-{bp}-{utility}` applies from that breakpoint up.

```html
<!-- 1 column on phones, 2 from 640px, 4 from 1024px -->
<div class="nova-d-grid nova-cols-1 nova-sm-cols-2 nova-lg-cols-4 nova-gap-4">...</div>
```

## 4. Which layout tool do I use?

| I want to... | Use | Needs breakpoints? |
| --- | --- | --- |
| Centre my page content with safe margins | `nova-container` | No |
| Centre content but let a banner touch the screen edges | `nova-page` + `nova-bleed` | No |
| Space things vertically | `nova-stack` (or `nova-flow` for CMS content) | No |
| A row of buttons, tags or chips that wraps | `nova-cluster` | No |
| A grid of cards that fills the space | `nova-grid-auto` | No |
| Exact column control (a 8/4 split) | `nova-grid` + `nova-col-8 nova-col-4` (with `nova-md-*`) | Yes |
| Equal columns that change count by screen | `nova-d-grid nova-cols-1 nova-md-cols-3` | Yes |
| Fixed-width side next to fluid content | `nova-sidebar` | No |
| 2-4 items that sit in a row, then stack | `nova-switcher` | No |
| A full-screen hero or empty state | `nova-cover` | No |
| A horizontal swipe rail | `nova-reel` | No |
| An image cropped to a ratio | `nova-frame` | No |
| An app with header, side navigation, main, footer | `nova-shell` | Built in |
| A component that adapts to where it's placed | `nova-cq` + `nova-cq-md-*` | Container-based |

## 5. Containers and gutters

`nova-container` centres its content, caps the width, and adds side padding.

| Class | Max width | Use for |
| --- | --- | --- |
| `nova-container` | `76rem` (1216px) | Default pages |
| `nova-container-sm` | `36rem` (576px) | Sign-in, narrow forms |
| `nova-container-md` | `46rem` (736px) | Articles with wide media |
| `nova-container-lg` | `62rem` (992px) | Dense content |
| `nova-container-xl` / `-2xl` | `76rem` / `90rem` | Wide dashboards |
| `nova-container-prose` | `65ch` | Long-form reading |
| `nova-container-fluid` | none | Edge to edge, still with gutters |

The gutter is `--nova-gutter`: 16px on a 320px phone, growing smoothly to 32px, and never below the device's
safe area (notches, rounded corners, landscape camera cut-outs).

**Full-bleed bands.** Put `nova-page` on the wrapper instead. Its children sit in the content column; add
`nova-bleed` to any child that should run edge to edge, and put a `nova-container` inside it to line its content back up.

```html
<div class="nova-page">
  <h1>Normal content</h1>
  <section class="nova-bleed nova-bg-accent-soft nova-py-8">
    <div class="nova-container"><p>Background runs edge to edge. Text lines up with the page.</p></div>
  </section>
</div>
```

**Section rhythm.** `nova-section` adds fluid vertical padding (32px on phones to 80px on large screens).

## 6. Grids

**12-column grid** for exact control. Spans are mobile first, so list the smallest size first.

```html
<div class="nova-grid">
  <main class="nova-col-12 nova-lg-col-8">Main</main>
  <aside class="nova-col-12 nova-lg-col-4">Aside</aside>
</div>
```

**Equal columns**, count changing by size:

```html
<div class="nova-d-grid nova-cols-1 nova-sm-cols-2 nova-xl-cols-4 nova-gap-5">...</div>
```

**Auto grid** with no breakpoints. Columns are at least `--nova-grid-min` wide, as many as fit:

```html
<ul class="nova-grid-auto nova-grid-auto-md" role="list">...</ul>
<!-- sizes: -xs 9rem, -sm 12rem, -md 16rem (default), -lg 22rem, -xl 30rem. Or set --nova-grid-min yourself. -->
```

`nova-grid-fill` keeps empty tracks, so a lone card keeps its size instead of stretching across the row.

**Gap** is `--nova-gap`, or use `nova-gap-4`, `nova-gap-x-4`, `nova-gap-y-4` (also responsive: `nova-md-gap-8`).

**Reordering.** Keep the DOM in reading order and reorder visually with `nova-order-first`, `nova-md-order-none`, etc.
Screen readers and keyboard users follow the DOM, so don't reorder things whose order carries meaning.

## 7. Spacing

A 4px scale. Use the tokens (`var(--nova-space-4)`) in your own CSS and `nova-p-4`, `nova-mt-4`, `nova-gap-4` in markup.

| Token / key | rem | px | Typical use |
| --- | --- | --- | --- |
| `1` | 0.25 | 4 | Icon gaps |
| `2` | 0.5 | 8 | Tight groups |
| `3` | 0.75 | 12 | Control padding |
| `4` | 1 | 16 | Default gap, card padding |
| `5` | 1.5 | 24 | Card grids |
| `6` | 2 | 32 | Section sub-spacing |
| `8` | 3 | 48 | Large blocks |
| `10` | 4 | 64 | |
| `12` | 6 | 96 | |
| `16` | 8 | 128 | |
| `--nova-space-fluid-s/m/l/xl` | clamp | 16-24 / 24-48 / 32-80 / 48-128 | Spacing that should breathe on bigger screens |

Rules of thumb:

- **Prefer `gap` over margins.** `nova-stack`, `nova-cluster` and the grids own the spacing between children, so a
  child never needs to know what's next to it.
- **Space belongs to the parent.** Don't put `margin-top` on a card to separate it from the previous one.
- **Related things closer than unrelated things.** Step down the scale for related items, up for new groups.
- **Single-side utilities** (`nova-mt-4`, `nova-pb-6`, `nova-ps-4`, `nova-pe-4`) exist for all keys. Responsive variants
  exist for `p`, `px`, `py`, `m`, `mx`, `my` and `gap` (`nova-md-px-8`).
- **Notches.** `nova-pt-safe`, `nova-pb-safe`, `nova-px-safe` add the device's safe-area inset. Use them on fixed bars
  that touch the screen edge (bottom tab bars, sticky headers).

## 8. Typography

Sizes up to `xl` are fixed; larger steps are *fluid*, scaling smoothly with the screen so you never write a
breakpoint for a heading.

| Token / class | Phone (320px) | Desktop (1440px) | Use |
| --- | --- | --- | --- |
| `xs` / `nova-text-xs` | 12px | 12px | Captions, badges |
| `sm` | 14px | 14px | Secondary text, tables |
| `md` | 16px | 16px | Body. Never smaller on inputs (iOS zooms below 16px) |
| `lg` | 18px | 18px | Lead text |
| `xl` | 22px | 22px | h4 |
| `2xl` | 24px | 30px | h3 |
| `3xl` | 28px | 40px | h2 |
| `4xl` | 34px | 56px | h1 |
| `5xl` / `nova-display` | 40px | 72px | Hero |

- **Heading level is structure; size is style.** Use `<h2 class="nova-h4">` when the outline says h2 but the design wants smaller.
- **Line length** 45-75 characters. `nova-prose`, `nova-center` and `nova-container-prose` cap at `65ch`.
- **Line height** 1.5 for body (`--nova-leading-normal`), 1.25 for headings, 1.65 for long reading.
- `nova-text-balance` evens out short headings; `nova-text-pretty` avoids one-word last lines.
- Wrap CMS or markdown output in `nova-prose`.
- Truncation: `nova-truncate` for one line, `nova-line-clamp-3` for three. Always make sure the full text is reachable
  (tooltip, expand, or detail page).

## 9. Recipes

### Card grid

```html
<ul class="nova-grid-auto nova-grid-auto-md" role="list">
  <li class="nova-card"><img class="nova-card__media" src="..." alt="" />
    <div class="nova-card__body nova-stack nova-stack-sm"><h3 class="nova-h5">Title</h3><p class="nova-small">Text</p></div></li>
</ul>
```

### Article with sidebar

The sidebar stacks above the article when the article would drop below half the row.

```html
<div class="nova-sidebar" style="--nova-sidebar-width: 18rem">
  <nav aria-label="Contents">...</nav>
  <article class="nova-prose">...</article>
</div>
```

### Pricing or feature columns

```html
<div class="nova-switcher" style="--nova-threshold: 48rem">
  <section class="nova-card nova-card__body">Free</section>
  <section class="nova-card nova-card__body">Team</section>
  <section class="nova-card nova-card__body">Enterprise</section>
</div>
```

### Dashboard shell

```html
<div class="nova-shell nova-shell-sidebar nova-shell-aside nova-shell-sticky-side">
  <header class="nova-shell__header">...</header>
  <nav class="nova-shell__sidebar" aria-label="Main">...</nav>
  <main class="nova-shell__main nova-p-5" id="main">...</main>
  <aside class="nova-shell__aside nova-p-5">...</aside>
  <footer class="nova-shell__footer">...</footer>
</div>
```

On phones everything stacks in reading order. From `md` the sidebar is a column; from `xl` the aside joins it.
Only add `nova-shell-sidebar` / `nova-shell-aside` for regions you use. Give side regions
`--nova-shell-sidebar` / `--nova-shell-aside` widths.

### Header with desktop menu and mobile button

```html
<header class="nova-container nova-cluster nova-cluster-between nova-py-3">
  <a href="/">Brand</a>
  <nav class="nova-hide-below-md" aria-label="Main">...links...</nav>
  <ui-button class="nova-hide-md-up" icon-only label="Menu">...</ui-button>
</header>
```

`nova-hide-below-md` hides under 768px; `nova-hide-md-up` hides from 768px up. Hidden elements are removed from the
accessibility tree, so the hidden one is not announced twice.

### Toolbar

```html
<div class="nova-cluster nova-cluster-between"><h2 class="nova-h4">Projects</h2><div class="nova-cluster"><button class="nova-btn nova-btn-secondary">Filter</button><button class="nova-btn">New</button></div></div>
```

### Form

```html
<form class="nova-stack">
  <div class="nova-form-row">
    <div class="nova-field"><label class="nova-label" for="a">First name</label><input class="nova-input" id="a" autocomplete="given-name" /></div>
    <div class="nova-field"><label class="nova-label" for="b">Last name</label><input class="nova-input" id="b" autocomplete="family-name" /></div>
  </div>
  <button class="nova-btn nova-btn-block">Save</button>
</form>
```

`nova-form-row` puts fields side by side when there's room and stacks them when there isn't. Inputs are 16px or larger,
so iOS doesn't zoom the page on focus. `nova-btn-block` makes the button full width, which suits phones; use a plain
`nova-btn` inside `<div class="nova-cluster nova-cluster-end">` for a right-aligned button on wider layouts.

### Data tables: three choices

1. **Scroll** (default): wrap in `nova-table-wrap`. Keep the first column recognisable. Simple and safe.
2. **Stack** (`nova-table-stack`): each row becomes a labelled card under 640px. Add `data-label` to every `<td>`,
   and add `role="table"`, `role="row"`, `role="cell"` so assistive tech keeps announcing a table.
3. **Cards**: for rows with rich content, don't use a table on phones at all; use `nova-grid-auto`.

For sortable, paginated, selectable tables use the `ui-table` web component.

### Full-bleed hero with a readable column

```html
<div class="nova-page">
  <header class="nova-bleed nova-bg-accent-soft nova-section">
    <div class="nova-container nova-stack"><p class="nova-eyebrow">New</p><h1 class="nova-display">Headline</h1></div>
  </header>
  <main>...</main>
</div>
```

### Swipe rail

```html
<ul class="nova-reel" role="list" style="--nova-reel-item: min(85%, 18rem)">...</ul>
```

Keyboard users can scroll it, but give each item focusable content (links) so the rail is reachable.

## 10. Container queries

Use them for anything reusable: a product card that must work in a 3-column grid, a sidebar and a modal.

```html
<div class="nova-cq">
  <div class="nova-d-grid nova-cols-1 nova-cq-md-cols-2 nova-gap-4">...</div>
</div>
```

| Class | Container is at least |
| --- | --- |
| `nova-cq-sm-*` | 24rem (384px) |
| `nova-cq-md-*` | 32rem (512px) |
| `nova-cq-lg-*` | 48rem (768px) |
| `nova-cq-xl-*` | 64rem (1024px) |

Available: `cols-1..6`, `flex-row`, `flex-col`, `d-none`, `d-block`, `d-flex`, `d-grid`. For anything else, write the query:

```css
.product-card { display: grid; gap: 1rem; }
@container (min-width: 32rem) { .product-card { grid-template-columns: 12rem 1fr; } }
```

The element with `nova-cq` is the container; styles apply to its **descendants**, never to itself.
`nova-cq-named` also gives the container the name `nova`, for `@container nova (min-width: ...)`.

## 11. Utilities

Utilities are single-purpose classes for quick, one-off adjustments. They sit in the highest layer, so they always
beat component and layout styles.

| Family | Examples | Responsive? |
| --- | --- | --- |
| Display | `nova-d-flex`, `nova-d-grid`, `nova-d-none` | Yes |
| Flex | `nova-flex-col`, `nova-flex-wrap`, `nova-justify-between`, `nova-items-center` | Yes |
| Flex items | `nova-flex-1`, `nova-grow`, `nova-shrink-0`, `nova-self-end` | No |
| Grid | `nova-cols-3`, `nova-col-6`, `nova-col-full`, `nova-row-2` | cols and col: Yes |
| Gap | `nova-gap-4`, `nova-gap-x-2`, `nova-gap-y-6` | Yes |
| Padding / margin | `nova-p-4`, `nova-px-6`, `nova-mt-8`, `nova-mx-auto` | `p`, `px`, `py`, `m`, `mx`, `my`: Yes |
| Order | `nova-order-first`, `nova-order-2` | Yes |
| Text align | `nova-text-center`, `nova-text-end` | Yes |
| Show / hide | `nova-hide-md-up`, `nova-hide-below-md` | Per breakpoint |
| Size | `nova-w-full`, `nova-max-w-prose`, `nova-min-h-screen`, `nova-h-dvh` | No |
| Position | `nova-relative`, `nova-sticky-top`, `nova-inset-0`, `nova-z-10` | No |
| Type | `nova-text-lg`, `nova-font-semibold`, `nova-uppercase`, `nova-truncate` | No |
| Colour | `nova-text-muted`, `nova-bg-surface`, `nova-bg-accent-soft` | No (theme-aware) |
| Border, radius, shadow | `nova-border`, `nova-rounded-lg`, `nova-shadow-md` | No |
| Accessibility | `nova-sr-only`, `nova-not-sr-only` | No |

Notes:

- **Hide wins.** Show/hide classes come last, so `nova-d-flex nova-hide-md-up` is hidden from `md` up.
- **Colours are tokens**, so `nova-bg-surface nova-text-fg` is correct in light and dark without any `dark:` variants.
- **When to stop using utilities.** If you copy the same 8 classes a third time, make it a component class in your own
  CSS (or a web component) and use the tokens inside it.
- Need a value that isn't here? Write it in your own CSS using the tokens, or add it to
  `scripts/generate-utilities.mjs` and run `pnpm generate`.

## 12. Accessibility

- **Reflow.** Content must work at 320 CSS px wide (a 1280px screen at 400% zoom) with no two-dimensional scrolling,
  except data tables and code. Use `nova-table-wrap` for tables, `nova-break-words` for long strings.
- **Zoom and text size.** Breakpoints and spacing are in `rem`/`em`, so larger text makes layouts adapt instead of overflow.
- **Touch targets.** Controls grow to `--nova-touch-target` (44px) on touch screens (`@media (pointer: coarse)`).
  Keep at least 8px between adjacent targets.
- **Focus.** One consistent 2px outline (`:focus-visible`). Don't remove it; restyle it if you must, and keep 3:1 contrast
  against its background.
- **Colour contrast.** Every text token pair meets WCAG AA (4.5:1) in both themes, and control borders meet 3:1
  (WCAG 1.4.11). The build checks all 46 pairs (`pnpm --filter @nova-ui/css test`) and fails if a token change breaks one.
  If you add brand colours, check them the same way.
- **Colour is not the only signal.** Pair status colours with an icon or text (the alert and badge components do).
- **Motion.** The reset shortens animations and transitions for people who choose reduced motion, and smooth scrolling
  only turns on when they haven't. Don't rely on motion to convey information.
- **Order.** Visual reordering (`nova-order-*`, grid placement) doesn't change keyboard or screen-reader order. Keep the
  DOM order logical.
- **Hidden content.** `nova-hide-*` uses `display: none`, so hidden content is removed from the accessibility tree. Use
  `nova-sr-only` for text that should be read but not seen.
- **Landmarks and skip link.** One `<main>`, labelled `<nav>`s, and a `nova-skip-link` as the first focusable element.
- **Language and direction.** Set `lang` on `<html>`, and `dir="rtl"` for right-to-left languages.

## 13. Theming and dark mode

Colours are tokens, with a light and a dark set. Set `data-theme="light" | "dark"` on `<html>`. Without it, the page
follows the operating system. The `@nova-ui/core` theme manager (`setThemeMode`, `<ui-theme-toggle>`) does this and
remembers the choice. For a pure-CSS page, a tiny script is enough:

```html
<script>
  document.documentElement.dataset.theme =
    localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
</script>
```

Put that in `<head>`, before the stylesheet's first paint, to avoid a flash of the wrong theme.

**Brand colours.** Override the tokens in your own CSS:

```css
:root {
  --nova-color-accent: #5b3fd1;
  --nova-color-accent-hover: #4a32b0;
  --nova-color-accent-active: #3b2891;
  --nova-color-accent-soft: #eeeafb;
}
[data-theme='dark'] {
  --nova-color-accent: #a99bff;
  --nova-color-accent-hover: #c1b7ff;
  --nova-color-accent-soft: #231d4a;
}
```

Then check contrast for the pairs listed in `scripts/check.mjs`. Everything (web components, CSS components,
utilities, the editor) follows automatically.

## 14. Overriding and layers

Nova's CSS is organised in cascade layers, lowest to highest priority:

```
nova.reset  <  nova.tokens  <  nova.base  <  nova.layout  <  nova.components  <  nova.utilities
```

**Your own unlayered CSS beats all of it**, whatever its specificity. So overriding is just writing a normal rule:

```css
.nova-btn { border-radius: 999px; }   /* wins, no !important, no specificity tricks */
```

Base rules inside Nova use `:where()` (zero specificity), so a modifier class always overrides a primitive.

**Your own layer.** To slot your styles between components and utilities (so utilities still win), declare the order
*before* the stylesheet loads:

```html
<style>@layer nova.reset, nova.tokens, nova.base, nova.layout, nova.components, app, nova.utilities;</style>
<link rel="stylesheet" href=".../nova.min.css" />
<style>@layer app { .hero { ... } }</style>
```

Customising a layout primitive is done with custom properties it exposes. They are registered as **non-inheriting**
(`@property`), so setting one on an element affects that element only. A `--nova-gap` on an outer wrapper never changes
the spacing of a cluster or grid nested inside it:
`--nova-gap`, `--nova-grid-min`, `--nova-sidebar-width`, `--nova-content-min`, `--nova-threshold`,
`--nova-cover-min`, `--nova-reel-item`, `--nova-column-width`, `--nova-ratio`, `--nova-sticky-offset`,
`--nova-shell-sidebar`, `--nova-shell-aside`, `--nova-flow-space`, `--nova-measure`.

## 15. Right-to-left, print, performance

**RTL.** Everything uses logical properties, so `<html dir="rtl">` flips padding, margins, borders, text alignment,
`nova-sidebar-end` and the shell. Icons that imply direction (arrows, chevrons) need flipping in your own CSS:
`[dir='rtl'] .icon-arrow { transform: scaleX(-1); }`.

**Print.** `print.css` (included) hides `nova-print-hidden` elements, shows `nova-print-only`, removes shadows and
backgrounds, avoids breaking cards and table rows across pages, prints link URLs inside `nova-prose`, and drops the
shell's side regions.

**Performance.**

- `nova.min.css` is 12.9 KB over the wire. Utilities are about two thirds of that. If size matters, import
  `tokens.css`, `reset.css`, `typography.css`, `layout.css` and `components.css` (about 9 KB gzipped together) and write the rest yourself.
- The stylesheet is render-blocking; keep it in `<head>`, serve it with long-lived caching and compression.
- Layout primitives rely on the browser's layout engine, not JavaScript. Nothing here runs script.
- Avoid animating layout properties (`width`, `height`, `top`). Animate `transform` and `opacity`.

## 16. Browser support

Built for current evergreen browsers (Chrome, Edge, Safari, Firefox).

| Feature | Used for | Available since |
| --- | --- | --- |
| Cascade layers (`@layer`) | Easy overriding | 2022 |
| Container queries | `nova-cq-*` | early 2023 |
| `:where()`, logical properties, `aspect-ratio`, `clamp()`, `gap` | Everywhere | 2020-2022 |
| `dvh` units | Full-height layouts (with a `vh` fallback) | 2022 |
| `color-mix()` | Hover shades | 2023 |
| `text-wrap: balance / pretty` | Nicer line breaks | Progressive: ignored where unsupported |

**Older browsers.** A browser without cascade-layer support ignores every `@layer` block, so *none* of the layered
stylesheet applies. If you must support those, use `nova.compat.css`: the same rules without layers (it keeps Nova's own
precedence, but your CSS then wins by source order and specificity instead of automatically). Container-query utilities
simply don't apply there, so design `nova-cq-*` layouts so the default (narrow) state is usable.

## 17. Conventions

- **Prefix.** Everything is `nova-` (classes) and `--nova-` (custom properties), so it can't collide with other CSS.
- **Blocks and parts.** Components use `nova-card` with parts `nova-card__body`; variants are `nova-card-raised`.
  Layout modifiers are `nova-stack-lg`, `nova-container-prose`.
- **States** are `is-invalid` / `is-disabled`, or the native attribute (`:disabled`, `aria-invalid="true"`). Prefer the attribute.
- **Responsive prefix** is always before the utility: `nova-md-col-6`, never `nova-col-6-md`.
- **Adding utilities.** Edit `scripts/generate-utilities.mjs`, run `pnpm --filter @nova-ui/css build`. Don't edit
  `src/generated/utilities.css` by hand.
- **Tokens have one home.** Colour, type, radius, shadow and motion tokens live in `@nova-ui/core`
  (`src/global/tokens.css`); layout tokens live in `src/tokens.css` here. The build includes both.
- **Tests.** `pnpm --filter @nova-ui/css test` checks every built file is well-formed, the minifier keeps every
  rule, the compat build has no layers, contrast ratios hold, and every class used in `docs/index.html` exists.
  `pnpm --filter @nova-ui/css test:browser` (needs Playwright) loads the guide in Chromium at nine widths and asserts on
  real computed layout: no horizontal overflow, the shell reflowing, grids and primitives changing column counts,
  container queries, no gap leaking into nested primitives, and the same results from the layered and compat builds.
