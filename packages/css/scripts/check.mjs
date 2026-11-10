// Sanity checks for the built CSS. `node scripts/check.mjs` (run after `build`).
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let failures = 0;
const fail = (msg) => { failures++; console.error('FAIL', msg); };
const ok = (msg) => console.log('ok  ', msg);

const strip = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')/g, '""');

const blocks = (css) => strip(css).split('{').length;
const blocksCount = blocks;

function balanced(name, css) {
  const s = strip(css);
  const count = (c) => s.split(c).length - 1;
  if (count('{') !== count('}')) fail(`${name}: unbalanced braces (${count('{')} open, ${count('}')} close)`);
  else if (count('(') !== count(')')) fail(`${name}: unbalanced parentheses`);
  else return true;
  return false;
}

const files = ['nova', 'tokens', 'reset', 'typography', 'layout', 'components', 'icons', 'utilities', 'print'];
for (const f of files) {
  const p = join(root, 'dist', `${f}.css`);
  if (!existsSync(p)) { fail(`dist/${f}.css missing. Run the build first.`); continue; }
  if (balanced(`${f}.css`, readFileSync(p, 'utf8'))) ok(`${f}.css is well-formed`);
}

const full = readFileSync(join(root, 'dist/nova.css'), 'utf8');
const iconCss = readFileSync(join(root, 'dist/icons.css'), 'utf8');
const iconNames = JSON.parse(readFileSync(join(root, 'dist/icons.json'), 'utf8'));
if (iconNames.length !== 4304 || !iconNames.includes('home')) fail(`expected 4,304 Material Symbols names, found ${iconNames.length}`);
else ok(`Material Symbols browser catalog contains ${iconNames.length} names`);
const iconClasses = [...iconCss.matchAll(/\.nova-icon-(?!filled\b)[\w-]+::before/g)].length;
if (iconClasses < 4000) fail(`expected the full Material Symbols catalog, found ${iconClasses} icon classes`);
else ok(`Material Symbols catalog contains ${iconClasses} classes`);
for (const asset of ['material-symbols-outlined.woff2', 'MATERIAL_SYMBOLS_LICENSE.txt']) {
  if (!existsSync(join(root, 'dist', asset))) fail(`dist/${asset} missing. Run the icon refresh and build.`);
  else ok(`dist/${asset} is present`);
}
for (const className of ['.nova-p-4', '.nova-mt-4', '.nova-animate-spin', '.nova-animate-fade-in']) {
  if (!full.includes(`${className}{`)) fail(`${className} is missing from nova.css`);
}
if (!/prefers-reduced-motion:\s*reduce/.test(full)) fail('motion utilities must respect prefers-reduced-motion');
else ok('spacing and motion utilities are included with reduced-motion support');
for (const iconName of ['.nova-icon-home::before', '.nova-icon-arrow-back::before']) {
  if (!iconCss.includes(iconName)) fail(`${iconName} is missing from icons.css`);
}
const min = readFileSync(join(root, 'dist/nova.min.css'), 'utf8');
balanced('nova.min.css', min);
const compat = readFileSync(join(root, 'dist/nova.compat.css'), 'utf8');
if (balanced('nova.compat.css', compat)) {
  if (/@layer/.test(compat)) fail('nova.compat.css still contains @layer');
  else if (blocksCount(compat) >= blocksCount(min)) fail('compat build should have fewer blocks than the layered build (layer wrappers removed)');
  else ok(`compat build has no @layer (${blocksCount(min) - blocksCount(compat)} wrappers removed, all other rules kept)`);
}
if (blocks(full) === blocks(min)) ok(`minified output keeps every rule (${blocks(full) - 1} blocks)`);
else fail(`minifier changed the rule count: ${blocks(full)} vs ${blocks(min)}`);
if (/;;/.test(min) || /\{;/.test(min)) fail('minified output has empty declarations');
if (!/^\/\*![^]*?\*\/\s*@layer nova\.reset/.test(min)) fail('layer order statement must come first in nova.min.css');
else ok('layer order statement comes first');
if (/@import/.test(full)) fail('nova.css still contains @import');
else ok('no unresolved @import');
for (const token of ['--nova-color-accent', '--nova-gutter', '--nova-container-xl', '--nova-space-fluid-l']) {
  if (!full.includes(token + ':')) fail(`token ${token} is not defined in nova.css`);
}
ok('core and layout tokens are present');

// ---- Colour contrast: text pairs >= 4.5:1 (WCAG AA), control borders >= 3:1 (WCAG 1.4.11), both themes ----
const lin = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const lum = (h) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const tokensIn = (block) => {
  const raw = Object.fromEntries([...block.matchAll(/--nova-color-([\w-]+):\s*(#[0-9a-fA-F]{6}|var\(--nova-color-([\w-]+)\))/g)]
    .map((m) => [m[1], m[3] ?? m[2]]));
  const resolve = (name, visited = new Set()) => {
    if (visited.has(name)) return undefined;
    visited.add(name);
    const value = raw[name];
    return value?.startsWith('#') ? value : value ? resolve(value, visited) : undefined;
  };
  return Object.fromEntries(Object.keys(raw).map((name) => [name, resolve(name)]));
};
const noComments = full.replace(/\/\*[\s\S]*?\*\//g, '');
const blocksWithBg = [...noComments.matchAll(/([^{}]*)\{([^{}]*--nova-color-bg:[^{}]*)\}/g)];
const light = blocksWithBg.find((m) => /data-theme='light'/.test(m[1]));
const dark = blocksWithBg.find((m) => /data-theme='dark'/.test(m[1]));
const TEXT = [['fg', 'bg'], ['fg', 'surface'], ['fg-muted', 'surface'], ['fg-muted', 'bg'], ['fg-muted', 'surface-sunken'], ['fg-subtle', 'surface'],
  ['fg-subtle', 'bg'], ['fg-subtle', 'surface-sunken'], ['accent', 'surface'], ['accent', 'bg'], ['fg-on-accent', 'accent'], ['accent', 'accent-soft'],
  ['danger', 'surface'], ['success', 'surface'], ['warning', 'surface'], ['info', 'surface'], ['danger', 'danger-soft'], ['success', 'success-soft'],
  ['warning', 'warning-soft'], ['info', 'info-soft'], ['fg', 'accent-soft']];
const UI = [['border-strong', 'surface'], ['border-strong', 'bg']];
if (!light || !dark) fail('could not find the light/dark token blocks to check contrast');
else {
  let bad = 0;
  for (const [theme, m] of [['light', light], ['dark', dark]]) {
    const t = tokensIn(m[2]);
    for (const [f, b, min] of [...TEXT.map((p) => [...p, 4.5]), ...UI.map((p) => [...p, 3])]) {
      const r = ratio(t[f], t[b]);
      if (r < min) { bad++; fail(`${theme}: ${f} on ${b} is ${r.toFixed(2)}:1, needs ${min}:1`); }
    }
  }
  if (!bad) ok(`contrast: ${(TEXT.length + UI.length) * 2} token pairs meet WCAG AA / 1.4.11 in light and dark`);
}

const paletteNames = ['ocean', 'forest', 'sunset', 'berry', 'slate'];
const paletteRules = [...noComments.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
let paletteContrastFailures = 0;
for (const palette of paletteNames) {
  for (const theme of ['light', 'dark']) {
    const rule = paletteRules.find((m) => m[1].includes(`[data-palette='${palette}']`) && (theme === 'dark') === m[1].includes("data-theme='dark'"));
    if (!rule) { fail(`${theme} ${palette} palette is missing`); paletteContrastFailures++; continue; }
    const paletteTokens = tokensIn(rule[2]);
    for (const role of ['primary', 'secondary', 'tertiary']) {
      const foreground = paletteTokens[`on-${role}`];
      const background = paletteTokens[role];
      if (!foreground || !background) {
        fail(`${theme} ${palette} palette is missing ${role} contrast tokens`);
        paletteContrastFailures++;
      } else {
        const value = ratio(foreground, background);
        if (value < 4.5) {
          fail(`${theme} ${palette} ${role} contrast is ${value.toFixed(2)}:1, needs 4.5:1`);
          paletteContrastFailures++;
        }
      }
    }
  }
}
if (!paletteContrastFailures) ok(`all 30 palette foreground pairs meet WCAG AA`);

// Every .nova-* class used in the docs page must exist in the CSS.
const docs = join(root, 'docs/index.html');
const iconDocs = join(root, 'docs/icons.html');
if (!existsSync(iconDocs)) fail('docs/icons.html missing. Run the icon refresh script.');
else if (!readFileSync(iconDocs, 'utf8').includes('nova-icon-')) fail('docs/icons.html does not render icon classes');
else ok('searchable icon catalog is present');
if (existsSync(docs)) {
  const html = readFileSync(docs, 'utf8');
  const used = new Set();
  for (const m of html.matchAll(/class="([^"]+)"/g)) m[1].split(/\s+/).filter((c) => c.startsWith('nova-')).forEach((c) => used.add(c));
  const defined = new Set([...strip(full).matchAll(/\.(nova-[\w-]+)/g)].map((m) => m[1]));
  const missing = [...used].filter((c) => !defined.has(c));
  if (missing.length) fail(`docs use classes that don't exist: ${missing.join(', ')}`);
  else ok(`docs page uses ${used.size} classes, all defined`);
}

process.exit(failures ? 1 : 0);
