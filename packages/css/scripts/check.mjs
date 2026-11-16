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

const files = ['nova', 'tokens', 'reset', 'typography', 'layout', 'components', 'utilities', 'print'];
for (const f of files) {
  const p = join(root, 'dist', `${f}.css`);
  if (!existsSync(p)) { fail(`dist/${f}.css missing. Run the build first.`); continue; }
  if (balanced(`${f}.css`, readFileSync(p, 'utf8'))) ok(`${f}.css is well-formed`);
}

const full = readFileSync(join(root, 'dist/nova.css'), 'utf8');
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
const tokensIn = (block) => Object.fromEntries([...block.matchAll(/--nova-color-([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]));
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

// Every .nova-* class used in the docs page must exist in the CSS.
const docs = join(root, 'docs/index.html');
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
