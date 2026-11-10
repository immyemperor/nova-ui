// Generates src/generated/utilities.css. Zero dependencies: `node scripts/generate-utilities.mjs`.
// Rules are grouped by breakpoint (smallest first) so mobile-first cascade order is always correct.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'src/generated/utilities.css');

/** min-width breakpoints, in em so they follow the user's font size. */
const BREAKPOINTS = { sm: 40, md: 48, lg: 64, xl: 80, '2xl': 96 };
/** @container widths, in rem. */
const CQ = { sm: 24, md: 32, lg: 48, xl: 64 };

const SPACE = {
  0: '0',
  1: 'var(--nova-space-1)',
  2: 'var(--nova-space-2)',
  3: 'var(--nova-space-3)',
  4: 'var(--nova-space-4)',
  5: 'var(--nova-space-5)',
  6: 'var(--nova-space-6)',
  8: 'var(--nova-space-8)',
  10: 'var(--nova-space-10)',
  12: 'var(--nova-space-12)',
  16: 'var(--nova-space-16)',
};
const GAP_KEYS = Object.keys(SPACE);
const N12 = Array.from({ length: 12 }, (_, i) => i + 1);
const N6 = N12.slice(0, 6);

/** Each entry is [className-suffix, declarations]. */
const pairs = (obj) => Object.entries(obj);

/* ------------------------------------------------------------------ responsive families */
const responsive = [];

responsive.push(
  ...pairs({
    'd-block': 'display:block', 'd-inline': 'display:inline', 'd-inline-block': 'display:inline-block',
    'd-flex': 'display:flex', 'd-inline-flex': 'display:inline-flex', 'd-grid': 'display:grid',
    'd-inline-grid': 'display:inline-grid', 'd-contents': 'display:contents', 'd-none': 'display:none',
  }),
  ...pairs({
    'flex-row': 'flex-direction:row', 'flex-col': 'flex-direction:column',
    'flex-row-reverse': 'flex-direction:row-reverse', 'flex-col-reverse': 'flex-direction:column-reverse',
    'flex-wrap': 'flex-wrap:wrap', 'flex-nowrap': 'flex-wrap:nowrap',
  }),
  ...pairs({
    'justify-start': 'justify-content:flex-start', 'justify-center': 'justify-content:center',
    'justify-end': 'justify-content:flex-end', 'justify-between': 'justify-content:space-between',
    'justify-around': 'justify-content:space-around', 'justify-evenly': 'justify-content:space-evenly',
    'items-start': 'align-items:flex-start', 'items-center': 'align-items:center', 'items-end': 'align-items:flex-end',
    'items-stretch': 'align-items:stretch', 'items-baseline': 'align-items:baseline',
  }),
  ...pairs({
    'text-start': 'text-align:start', 'text-center': 'text-align:center', 'text-end': 'text-align:end', 'text-justify': 'text-align:justify',
  }),
  ...pairs({ 'order-first': 'order:-1', 'order-last': 'order:999', 'order-none': 'order:0', 'order-1': 'order:1', 'order-2': 'order:2', 'order-3': 'order:3' }),
  ...N12.map((n) => [`cols-${n}`, `grid-template-columns:repeat(${n},minmax(0,1fr))`]),
  ['cols-none', 'grid-template-columns:none'],
  ...N12.map((n) => [`col-${n}`, `grid-column:span ${n} / span ${n}`]),
  ['col-full', 'grid-column:1 / -1'],
  ['col-auto', 'grid-column:auto'],
  ...GAP_KEYS.map((k) => [`gap-${k}`, `gap:${SPACE[k]}`]),
  ...GAP_KEYS.map((k) => [`gap-x-${k}`, `column-gap:${SPACE[k]}`]),
  ...GAP_KEYS.map((k) => [`gap-y-${k}`, `row-gap:${SPACE[k]}`]),
);

// Spacing. Logical properties, so padding/margin flip correctly in right-to-left languages.
const spacingAll = { p: 'padding', m: 'margin' };
for (const [abbr, prop] of Object.entries(spacingAll)) {
  for (const k of GAP_KEYS) {
    responsive.push([`${abbr}-${k}`, `${prop}:${SPACE[k]}`]);
    responsive.push([`${abbr}x-${k}`, `${prop}-inline:${SPACE[k]}`]);
    responsive.push([`${abbr}y-${k}`, `${prop}-block:${SPACE[k]}`]);
  }
}
responsive.push(['m-auto', 'margin:auto'], ['mx-auto', 'margin-inline:auto'], ['my-auto', 'margin-block:auto']);

/* ------------------------------------------------------------------ base-only families */
const base = [];

// Single-side spacing (not responsive, to keep the file small; use px/py/gap for responsive tuning)
const sides = { s: 'inline-start', e: 'inline-end', t: 'block-start', b: 'block-end' };
for (const [abbr, prop] of Object.entries(spacingAll)) {
  for (const [side, logical] of Object.entries(sides)) {
    for (const k of GAP_KEYS) base.push([`${abbr}${side}-${k}`, `${prop}-${logical}:${SPACE[k]}`]);
  }
}
base.push(['ms-auto', 'margin-inline-start:auto'], ['me-auto', 'margin-inline-end:auto']);

// Safe-area padding for phones with notches / home indicators
base.push(
  ['pt-safe', 'padding-block-start:env(safe-area-inset-top,0px)'],
  ['pb-safe', 'padding-block-end:env(safe-area-inset-bottom,0px)'],
  ['ps-safe', 'padding-inline-start:env(safe-area-inset-left,0px)'],
  ['pe-safe', 'padding-inline-end:env(safe-area-inset-right,0px)'],
  ['px-safe', 'padding-inline:env(safe-area-inset-left,0px) env(safe-area-inset-right,0px)'],
);

// Flex items
base.push(
  ['flex-1', 'flex:1 1 0%'], ['flex-auto', 'flex:1 1 auto'], ['flex-none', 'flex:none'],
  ['grow', 'flex-grow:1'], ['grow-0', 'flex-grow:0'], ['shrink-0', 'flex-shrink:0'],
  ['self-start', 'align-self:flex-start'], ['self-center', 'align-self:center'], ['self-end', 'align-self:flex-end'], ['self-stretch', 'align-self:stretch'],
  ['grid-flow-dense', 'grid-auto-flow:dense'], ['place-center', 'place-items:center'],
  ...N6.map((n) => [`row-${n}`, `grid-row:span ${n} / span ${n}`]),
);

// Sizing
base.push(
  ['w-full', 'inline-size:100%'], ['w-auto', 'inline-size:auto'], ['w-fit', 'inline-size:fit-content'], ['w-min', 'inline-size:min-content'], ['w-max', 'inline-size:max-content'],
  ['w-screen', 'inline-size:100vw'],
  ['h-full', 'block-size:100%'], ['h-auto', 'block-size:auto'], ['h-fit', 'block-size:fit-content'], ['h-screen', 'block-size:100vh'], ['h-dvh', 'block-size:100dvh'],
  ['min-h-screen', 'min-block-size:100vh'], ['min-h-dvh', 'min-block-size:100dvh'], ['min-w-0', 'min-inline-size:0'], ['min-h-0', 'min-block-size:0'],
  ['max-w-none', 'max-inline-size:none'], ['max-w-full', 'max-inline-size:100%'], ['max-w-prose', 'max-inline-size:var(--nova-measure)'],
  ...Object.entries({ xs: 20, sm: 24, md: 28, lg: 32, xl: 36, '2xl': 42, '3xl': 48, '4xl': 56, '5xl': 64 }).map(([k, v]) => [`max-w-${k}`, `max-inline-size:${v}rem`]),
);

// Aspect ratios
base.push(
  ['ratio-square', 'aspect-ratio:1 / 1'], ['ratio-video', 'aspect-ratio:16 / 9'], ['ratio-4-3', 'aspect-ratio:4 / 3'],
  ['ratio-3-2', 'aspect-ratio:3 / 2'], ['ratio-21-9', 'aspect-ratio:21 / 9'], ['ratio-portrait', 'aspect-ratio:3 / 4'],
);

// Position, overflow, layering
base.push(
  ['static', 'position:static'], ['relative', 'position:relative'], ['absolute', 'position:absolute'], ['fixed', 'position:fixed'], ['sticky', 'position:sticky'],
  ['sticky-top', 'position:sticky;inset-block-start:var(--nova-sticky-offset,0)'],
  ['inset-0', 'inset:0'], ['top-0', 'inset-block-start:0'], ['bottom-0', 'inset-block-end:0'], ['start-0', 'inset-inline-start:0'], ['end-0', 'inset-inline-end:0'],
  ['overflow-hidden', 'overflow:hidden'], ['overflow-auto', 'overflow:auto'], ['overflow-clip', 'overflow:clip'], ['overflow-visible', 'overflow:visible'],
  ['overflow-x-auto', 'overflow-x:auto'], ['overflow-y-auto', 'overflow-y:auto'],
  ['z-0', 'z-index:0'], ['z-10', 'z-index:10'], ['z-20', 'z-index:20'], ['z-30', 'z-index:30'], ['z-dropdown', 'z-index:var(--nova-z-dropdown)'], ['z-modal', 'z-index:var(--nova-z-modal)'],
);

// Typography
base.push(
  ...['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'].map((k) => [`text-${k}`, `font-size:var(--nova-text-${k})`]),
  ['font-regular', 'font-weight:var(--nova-weight-regular)'], ['font-medium', 'font-weight:var(--nova-weight-medium)'],
  ['font-semibold', 'font-weight:var(--nova-weight-semibold)'], ['font-bold', 'font-weight:var(--nova-weight-bold)'],
  ['font-sans', 'font-family:var(--nova-font-sans)'], ['font-mono', 'font-family:var(--nova-font-mono)'],
  ['leading-tight', 'line-height:var(--nova-leading-tight)'], ['leading-snug', 'line-height:var(--nova-leading-snug)'],
  ['leading-normal', 'line-height:var(--nova-leading-normal)'], ['leading-relaxed', 'line-height:var(--nova-leading-relaxed)'],
  ['tracking-tight', 'letter-spacing:var(--nova-tracking-tight)'], ['tracking-wide', 'letter-spacing:var(--nova-tracking-wide)'],
  ['uppercase', 'text-transform:uppercase'], ['capitalize', 'text-transform:capitalize'], ['normal-case', 'text-transform:none'],
  ['italic', 'font-style:italic'], ['underline', 'text-decoration:underline'], ['no-underline', 'text-decoration:none'], ['line-through', 'text-decoration:line-through'],
  ['text-balance', 'text-wrap:balance'], ['text-pretty', 'text-wrap:pretty'], ['tabular-nums', 'font-variant-numeric:tabular-nums'],
  ['truncate', 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap'],
  ['break-words', 'overflow-wrap:anywhere'], ['whitespace-nowrap', 'white-space:nowrap'], ['whitespace-normal', 'white-space:normal'],
  ...[1, 2, 3, 4, 5].map((n) => [`line-clamp-${n}`, `display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:${n};line-clamp:${n};overflow:hidden`]),
);

// Colour (tokens only, so light/dark theming needs no extra classes)
const text = { fg: 'fg', muted: 'fg-muted', subtle: 'fg-subtle', primary: 'primary', secondary: 'secondary', tertiary: 'tertiary', accent: 'accent', success: 'success', warning: 'warning', danger: 'danger', info: 'info', 'on-primary': 'on-primary', 'on-secondary': 'on-secondary', 'on-tertiary': 'on-tertiary', 'on-accent': 'fg-on-accent' };
for (const [k, v] of Object.entries(text)) base.push([`text-${k}`, `color:var(--nova-color-${v})`]);
  const bg = { page: 'bg', surface: 'surface', raised: 'surface-raised', sunken: 'surface-sunken', primary: 'primary', 'primary-soft': 'primary-soft', secondary: 'secondary', 'secondary-soft': 'secondary-soft', tertiary: 'tertiary', 'tertiary-soft': 'tertiary-soft', accent: 'accent', 'accent-soft': 'accent-soft',
  'success-soft': 'success-soft', 'warning-soft': 'warning-soft', 'danger-soft': 'danger-soft', 'info-soft': 'info-soft' };
for (const [k, v] of Object.entries(bg)) base.push([`bg-${k}`, `background-color:var(--nova-color-${v})`]);
base.push(['bg-transparent', 'background-color:transparent']);

// Borders, radius, shadow
base.push(
  ['border', 'border:1px solid var(--nova-color-border)'], ['border-0', 'border:0'],
  ['border-t', 'border-block-start:1px solid var(--nova-color-border)'], ['border-b', 'border-block-end:1px solid var(--nova-color-border)'],
  ['border-s', 'border-inline-start:1px solid var(--nova-color-border)'], ['border-e', 'border-inline-end:1px solid var(--nova-color-border)'],
  ['border-strong', 'border-color:var(--nova-color-border-strong)'], ['border-accent', 'border-color:var(--nova-color-accent)'], ['border-danger', 'border-color:var(--nova-color-danger)'],
  ['rounded-none', 'border-radius:0'], ['rounded', 'border-radius:var(--nova-radius-control)'], ['rounded-lg', 'border-radius:var(--nova-radius-surface)'], ['rounded-full', 'border-radius:var(--nova-radius-pill)'],
  ['shadow-none', 'box-shadow:none'], ['shadow-sm', 'box-shadow:var(--nova-shadow-sm)'], ['shadow-md', 'box-shadow:var(--nova-shadow-md)'], ['shadow-lg', 'box-shadow:var(--nova-shadow-lg)'],
);

// Interaction and misc
base.push(
  ['cursor-pointer', 'cursor:pointer'], ['cursor-not-allowed', 'cursor:not-allowed'], ['select-none', 'user-select:none'],
  ['pointer-events-none', 'pointer-events:none'], ['pointer-events-auto', 'pointer-events:auto'],
  ['invisible', 'visibility:hidden'], ['visible', 'visibility:visible'],
  ['opacity-50', 'opacity:.5'], ['opacity-75', 'opacity:.75'],
  ['object-cover', 'object-fit:cover'], ['object-contain', 'object-fit:contain'],
  ['transition', 'transition:color var(--nova-duration-fast) var(--nova-ease-standard),background-color var(--nova-duration-fast) var(--nova-ease-standard),border-color var(--nova-duration-fast) var(--nova-ease-standard),box-shadow var(--nova-duration-fast) var(--nova-ease-standard),opacity var(--nova-duration-fast) var(--nova-ease-standard),transform var(--nova-duration-fast) var(--nova-ease-standard)'],
  // Hide visually, keep for screen readers
  ['sr-only', 'position:absolute;inline-size:1px;block-size:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0'],
  ['not-sr-only', 'position:static;inline-size:auto;block-size:auto;margin:0;overflow:visible;clip:auto;white-space:normal'],
);

// Motion helpers respect the user's reduced-motion preference.
base.push(
  ['animate-spin', 'animation:nova-spin 1s linear infinite'],
  ['animate-pulse', 'animation:nova-pulse 1.5s ease-in-out infinite'],
  ['animate-bounce', 'animation:nova-bounce 1s infinite'],
  ['animate-fade-in', 'animation:nova-fade-in var(--nova-duration-base) var(--nova-ease-standard) both'],
  ['animate-slide-up', 'animation:nova-slide-up var(--nova-duration-base) var(--nova-ease-standard) both'],
);

/* ------------------------------------------------------------------ output */
const rule = (cls, decl) => `.nova-${cls}{${decl}}`;
const lines = [];
const count = { base: 0, responsive: 0, hide: 0, cq: 0 };

lines.push('/* GENERATED by scripts/generate-utilities.mjs. Do not edit by hand: change the generator and run `pnpm generate`. */');
lines.push('@layer nova.reset, nova.tokens, nova.base, nova.layout, nova.components, nova.utilities;');
lines.push('@layer nova.utilities {');

lines.push('/* ---- base (all screen sizes) ---- */');
for (const [k, d] of [...responsive, ...base]) { lines.push(rule(k, d)); count.base++; }
lines.push('@keyframes nova-spin{to{transform:rotate(360deg)}}');
lines.push('@keyframes nova-pulse{50%{opacity:.5}}');
lines.push('@keyframes nova-bounce{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(.8,0,1,1)}50%{transform:translateY(0);animation-timing-function:cubic-bezier(0,0,.2,1)}}');
lines.push('@keyframes nova-fade-in{from{opacity:0}to{opacity:1}}');
lines.push('@keyframes nova-slide-up{from{opacity:0;transform:translateY(.5rem)}to{opacity:1;transform:translateY(0)}}');
lines.push('@media (prefers-reduced-motion:reduce){.nova-animate-spin,.nova-animate-pulse,.nova-animate-bounce,.nova-animate-fade-in,.nova-animate-slide-up{animation:none}}');

for (const [bp, em] of Object.entries(BREAKPOINTS)) {
  lines.push(`/* ---- ${bp}: min-width ${em}em ---- */`);
  lines.push(`@media (min-width:${em}em){`);
  for (const [k, d] of responsive) { lines.push(rule(`${bp}-${k}`, d)); count.responsive++; }
  lines.push('}');
}

// Container-query variants for the properties components most often flip: columns, direction, display
const cqFamilies = [
  ...N6.map((n) => [`cols-${n}`, `grid-template-columns:repeat(${n},minmax(0,1fr))`]),
  ['flex-row', 'flex-direction:row'], ['flex-col', 'flex-direction:column'],
  ['d-none', 'display:none'], ['d-block', 'display:block'], ['d-flex', 'display:flex'], ['d-grid', 'display:grid'],
];
for (const [bp, rem] of Object.entries(CQ)) {
  lines.push(`/* ---- container query ${bp}: container min-width ${rem}rem (put .nova-cq on the parent) ---- */`);
  lines.push(`@container (min-width:${rem}rem){`);
  for (const [k, d] of cqFamilies) { lines.push(rule(`cq-${bp}-${k}`, d)); count.cq++; }
  lines.push('}');
}

// Show/hide last so they win over the display utilities above.
lines.push('/* ---- visibility by screen size. -up hides at that size and larger; -below hides under it ---- */');
for (const [bp, em] of Object.entries(BREAKPOINTS)) {
  lines.push(`@media (min-width:${em}em){.nova-hide-${bp}-up{display:none}}`);
  lines.push(`@media (max-width:${(em - 0.01).toFixed(2)}em){.nova-hide-below-${bp}{display:none}}`);
  count.hide += 2;
}
lines.push('}');

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, lines.join('\n') + '\n');
console.log(`utilities: ${count.base} base, ${count.responsive} responsive, ${count.cq} container-query, ${count.hide} visibility rules`);
