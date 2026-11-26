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
  1: 'var(--kvui-space-1)',
  2: 'var(--kvui-space-2)',
  3: 'var(--kvui-space-3)',
  4: 'var(--kvui-space-4)',
  5: 'var(--kvui-space-5)',
  6: 'var(--kvui-space-6)',
  8: 'var(--kvui-space-8)',
  10: 'var(--kvui-space-10)',
  12: 'var(--kvui-space-12)',
  16: 'var(--kvui-space-16)',
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
  ['max-w-none', 'max-inline-size:none'], ['max-w-full', 'max-inline-size:100%'], ['max-w-prose', 'max-inline-size:var(--kvui-measure)'],
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
  ['sticky-top', 'position:sticky;inset-block-start:var(--kvui-sticky-offset,0)'],
  ['inset-0', 'inset:0'], ['top-0', 'inset-block-start:0'], ['bottom-0', 'inset-block-end:0'], ['start-0', 'inset-inline-start:0'], ['end-0', 'inset-inline-end:0'],
  ['overflow-hidden', 'overflow:hidden'], ['overflow-auto', 'overflow:auto'], ['overflow-clip', 'overflow:clip'], ['overflow-visible', 'overflow:visible'],
  ['overflow-x-auto', 'overflow-x:auto'], ['overflow-y-auto', 'overflow-y:auto'],
  ['z-0', 'z-index:0'], ['z-10', 'z-index:10'], ['z-20', 'z-index:20'], ['z-30', 'z-index:30'], ['z-dropdown', 'z-index:var(--kvui-z-dropdown)'], ['z-modal', 'z-index:var(--kvui-z-modal)'],
);

// Typography
base.push(
  ...['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'].map((k) => [`text-${k}`, `font-size:var(--kvui-text-${k})`]),
  ['font-regular', 'font-weight:var(--kvui-weight-regular)'], ['font-medium', 'font-weight:var(--kvui-weight-medium)'],
  ['font-semibold', 'font-weight:var(--kvui-weight-semibold)'], ['font-bold', 'font-weight:var(--kvui-weight-bold)'],
  ['font-sans', 'font-family:var(--kvui-font-sans)'], ['font-mono', 'font-family:var(--kvui-font-mono)'],
  ['leading-tight', 'line-height:var(--kvui-leading-tight)'], ['leading-snug', 'line-height:var(--kvui-leading-snug)'],
  ['leading-normal', 'line-height:var(--kvui-leading-normal)'], ['leading-relaxed', 'line-height:var(--kvui-leading-relaxed)'],
  ['tracking-tight', 'letter-spacing:var(--kvui-tracking-tight)'], ['tracking-wide', 'letter-spacing:var(--kvui-tracking-wide)'],
  ['uppercase', 'text-transform:uppercase'], ['capitalize', 'text-transform:capitalize'], ['normal-case', 'text-transform:none'],
  ['italic', 'font-style:italic'], ['underline', 'text-decoration:underline'], ['no-underline', 'text-decoration:none'], ['line-through', 'text-decoration:line-through'],
  ['text-balance', 'text-wrap:balance'], ['text-pretty', 'text-wrap:pretty'], ['tabular-nums', 'font-variant-numeric:tabular-nums'],
  ['truncate', 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap'],
  ['break-words', 'overflow-wrap:anywhere'], ['whitespace-nowrap', 'white-space:nowrap'], ['whitespace-normal', 'white-space:normal'],
  ...[1, 2, 3, 4, 5].map((n) => [`line-clamp-${n}`, `display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:${n};line-clamp:${n};overflow:hidden`]),
);

// Colour (tokens only, so light/dark theming needs no extra classes)
const text = { fg: 'fg', muted: 'fg-muted', subtle: 'fg-subtle', accent: 'accent', success: 'success', warning: 'warning', danger: 'danger', info: 'info', 'on-accent': 'fg-on-accent' };
for (const [k, v] of Object.entries(text)) base.push([`text-${k}`, `color:var(--kvui-color-${v})`]);
const bg = { page: 'bg', surface: 'surface', raised: 'surface-raised', sunken: 'surface-sunken', accent: 'accent', 'accent-soft': 'accent-soft',
  'success-soft': 'success-soft', 'warning-soft': 'warning-soft', 'danger-soft': 'danger-soft', 'info-soft': 'info-soft' };
for (const [k, v] of Object.entries(bg)) base.push([`bg-${k}`, `background-color:var(--kvui-color-${v})`]);
base.push(['bg-transparent', 'background-color:transparent']);

// Borders, radius, shadow
base.push(
  ['border', 'border:1px solid var(--kvui-color-border)'], ['border-0', 'border:0'],
  ['border-t', 'border-block-start:1px solid var(--kvui-color-border)'], ['border-b', 'border-block-end:1px solid var(--kvui-color-border)'],
  ['border-s', 'border-inline-start:1px solid var(--kvui-color-border)'], ['border-e', 'border-inline-end:1px solid var(--kvui-color-border)'],
  ['border-strong', 'border-color:var(--kvui-color-border-strong)'], ['border-accent', 'border-color:var(--kvui-color-accent)'], ['border-danger', 'border-color:var(--kvui-color-danger)'],
  ['rounded-none', 'border-radius:0'], ['rounded', 'border-radius:var(--kvui-radius-control)'], ['rounded-lg', 'border-radius:var(--kvui-radius-surface)'], ['rounded-full', 'border-radius:var(--kvui-radius-pill)'],
  ['shadow-none', 'box-shadow:none'], ['shadow-sm', 'box-shadow:var(--kvui-shadow-sm)'], ['shadow-md', 'box-shadow:var(--kvui-shadow-md)'], ['shadow-lg', 'box-shadow:var(--kvui-shadow-lg)'],
);

// Interaction and misc
base.push(
  ['cursor-pointer', 'cursor:pointer'], ['cursor-not-allowed', 'cursor:not-allowed'], ['select-none', 'user-select:none'],
  ['pointer-events-none', 'pointer-events:none'], ['pointer-events-auto', 'pointer-events:auto'],
  ['invisible', 'visibility:hidden'], ['visible', 'visibility:visible'],
  ['opacity-50', 'opacity:.5'], ['opacity-75', 'opacity:.75'],
  ['object-cover', 'object-fit:cover'], ['object-contain', 'object-fit:contain'],
  ['transition', 'transition:color var(--kvui-duration-fast) var(--kvui-ease-standard),background-color var(--kvui-duration-fast) var(--kvui-ease-standard),border-color var(--kvui-duration-fast) var(--kvui-ease-standard),box-shadow var(--kvui-duration-fast) var(--kvui-ease-standard),opacity var(--kvui-duration-fast) var(--kvui-ease-standard),transform var(--kvui-duration-fast) var(--kvui-ease-standard)'],
  // Hide visually, keep for screen readers
  ['sr-only', 'position:absolute;inline-size:1px;block-size:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0'],
  ['not-sr-only', 'position:static;inline-size:auto;block-size:auto;margin:0;overflow:visible;clip:auto;white-space:normal'],
);

/* ------------------------------------------------------------------ output */
const rule = (cls, decl) => `.kvui-${cls}{${decl}}`;
const lines = [];
const count = { base: 0, responsive: 0, hide: 0, cq: 0 };

lines.push('/* GENERATED by scripts/generate-utilities.mjs. Do not edit by hand: change the generator and run `pnpm generate`. */');
lines.push('@layer kvui.reset, kvui.tokens, kvui.base, kvui.layout, kvui.components, kvui.utilities;');
lines.push('@layer kvui.utilities {');

lines.push('/* ---- base (all screen sizes) ---- */');
for (const [k, d] of [...responsive, ...base]) { lines.push(rule(k, d)); count.base++; }

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
  lines.push(`/* ---- container query ${bp}: container min-width ${rem}rem (put .kvui-cq on the parent) ---- */`);
  lines.push(`@container (min-width:${rem}rem){`);
  for (const [k, d] of cqFamilies) { lines.push(rule(`cq-${bp}-${k}`, d)); count.cq++; }
  lines.push('}');
}

// Show/hide last so they win over the display utilities above.
lines.push('/* ---- visibility by screen size. -up hides at that size and larger; -below hides under it ---- */');
for (const [bp, em] of Object.entries(BREAKPOINTS)) {
  lines.push(`@media (min-width:${em}em){.kvui-hide-${bp}-up{display:none}}`);
  lines.push(`@media (max-width:${(em - 0.01).toFixed(2)}em){.kvui-hide-below-${bp}{display:none}}`);
  count.hide += 2;
}
lines.push('}');

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, lines.join('\n') + '\n');
console.log(`utilities: ${count.base} base, ${count.responsive} responsive, ${count.cq} container-query, ${count.hide} visibility rules`);
