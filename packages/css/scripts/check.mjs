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

const files = ['kvui', 'tokens', 'reset', 'typography', 'layout', 'components', 'utilities', 'print'];
for (const f of files) {
  const p = join(root, 'dist', `${f}.css`);
  if (!existsSync(p)) { fail(`dist/${f}.css missing. Run the build first.`); continue; }
  if (balanced(`${f}.css`, readFileSync(p, 'utf8'))) ok(`${f}.css is well-formed`);
}

const full = readFileSync(join(root, 'dist/kvui.css'), 'utf8');
const min = readFileSync(join(root, 'dist/kvui.min.css'), 'utf8');
balanced('kvui.min.css', min);
const compat = readFileSync(join(root, 'dist/kvui.compat.css'), 'utf8');
if (balanced('kvui.compat.css', compat)) {
  if (/@layer/.test(compat)) fail('kvui.compat.css still contains @layer');
  else if (blocksCount(compat) >= blocksCount(min)) fail('compat build should have fewer blocks than the layered build (layer wrappers removed)');
  else ok(`compat build has no @layer (${blocksCount(min) - blocksCount(compat)} wrappers removed, all other rules kept)`);
}
if (blocks(full) === blocks(min)) ok(`minified output keeps every rule (${blocks(full) - 1} blocks)`);
else fail(`minifier changed the rule count: ${blocks(full)} vs ${blocks(min)}`);
if (/;;/.test(min) || /\{;/.test(min)) fail('minified output has empty declarations');
if (!/^\/\*![^]*?\*\/\s*@layer kvui\.reset/.test(min)) fail('layer order statement must come first in kvui.min.css');
else ok('layer order statement comes first');
if (/@import/.test(full)) fail('kvui.css still contains @import');
else ok('no unresolved @import');
for (const token of ['--kvui-color-accent', '--kvui-gutter', '--kvui-container-xl', '--kvui-space-fluid-l']) {
  if (!full.includes(token + ':')) fail(`token ${token} is not defined in kvui.css`);
}
ok('core and layout tokens are present');

// ---- Colour contrast: text pairs >= 4.5:1 (WCAG AA), control borders >= 3:1 (WCAG 1.4.11), both themes ----
const lin = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const lum = (h) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const tokensIn = (block) => Object.fromEntries([...block.matchAll(/--kvui-((?:color|tint)-[\w-]+):\s*(#[0-9a-fA-F]{6}|rgb\([^)]*\))/g)].map((m) => [m[1].replace(/^color-/, ''), m[2]]));
const noComments = full.replace(/\/\*[\s\S]*?\*\//g, '');
const blocksWithBg = [...noComments.matchAll(/([^{}]*)\{([^{}]*--kvui-color-bg:[^{}]*)\}/g)];
const light = blocksWithBg.find((m) => /data-theme='light'/.test(m[1]));
const dark = blocksWithBg.find((m) => /data-theme='dark'/.test(m[1]));

// Translucent tokens are rgb(r g b / a). Composite them over a solid colour before measuring contrast.
const rgbTokenRe = /rgb\((\d+)\s+(\d+)\s+(\d+)\s*\/\s*([\d.]+)\)/;
const hexOf = (rgb) => '#' + rgb.map((n) => Math.round(n).toString(16).padStart(2, '0')).join('');
function resolveColour(value, over) {
  if (/^#[0-9a-f]{6}$/i.test(value)) return value;
  const m = rgbTokenRe.exec(value);
  if (!m || !over) return undefined;
  const a = Number(m[4]);
  const top = [m[1], m[2], m[3]].map(Number), base = [1, 3, 5].map((i) => parseInt(over.slice(i, i + 2), 16));
  return hexOf(top.map((c, i) => c * a + base[i] * (1 - a)));
}
const TEXT = [['fg', 'bg'], ['fg', 'surface'], ['fg-muted', 'surface'], ['fg-muted', 'bg'], ['fg-muted', 'surface-sunken'], ['fg-subtle', 'surface'],
  ['fg-subtle', 'bg'], ['fg-subtle', 'surface-sunken'], ['accent', 'surface'], ['accent', 'bg'], ['fg-on-accent', 'accent'], ['accent', 'accent-soft'],
  ['danger', 'surface'], ['success', 'surface'], ['warning', 'surface'], ['info', 'surface'], ['danger', 'danger-soft'], ['success', 'success-soft'],
  ['warning', 'warning-soft'], ['info', 'info-soft'], ['fg', 'accent-soft']];
const UI = [['border-strong', 'surface'], ['border-strong', 'bg']];
// Text placed on translucent tints (the tint is blended over the surface first)
const TINTS = ['hover', 'accent', 'accent-strong'];
// Accent text on a tint uses accent-hover (plain accent falls below 4.5:1 on the translucent tint).
const TINT_TEXT = [['fg', 'surface'], ['fg-muted', 'surface'], ['accent-hover', 'surface']];
if (!light || !dark) fail('could not find the light/dark token blocks to check contrast');
else {
  let bad = 0;
  for (const [theme, m] of [['light', light], ['dark', dark]]) {
    const raw = tokensIn(m[2]);
    const t = {};
    for (const [k, v] of Object.entries(raw)) if (v.startsWith('#')) t[k] = v;
    for (const k of Object.keys(raw)) if (k.startsWith('tint-')) t[k] = raw[k];
    const surfaceHex = t['surface'];
    // tints resolve over the surface they are drawn on
    for (const k of TINTS) if (raw['tint-' + k]) { const r = resolveColour(raw['tint-' + k], surfaceHex); if (r) t['tint-' + k] = r; }
    for (const name of TINTS) {
      const bgHex = t['tint-' + name];
      if (!bgHex) { bad++; fail(`${theme}: tint-${name} is missing`); continue; }
      for (const [f, b] of TINT_TEXT) {
        const fore = t[f];
        const r = ratio(fore, bgHex);
        if (r < 4.5) { bad++; fail(`${theme}: ${f} on tint-${name} (over surface) is ${r.toFixed(2)}:1, needs 4.5:1`); }
      }
    }
    for (const [f, b, min] of [...TEXT.map((p) => [...p, 4.5]), ...UI.map((p) => [...p, 3])]) {
      const r = ratio(t[f], t[b]);
      if (r < min) { bad++; fail(`${theme}: ${f} on ${b} is ${r.toFixed(2)}:1, needs ${min}:1`); }
    }
  }
  if (!bad) ok(`contrast: ${(TEXT.length + UI.length) * 2 + TINTS.length * TINT_TEXT.length * 2} token pairs (including translucent tints) meet WCAG AA in light and dark`);
}

// Every .kvui-* class used in the docs page must exist in the CSS.
const docs = join(root, 'docs/index.html');
if (existsSync(docs)) {
  const html = readFileSync(docs, 'utf8');
  const used = new Set();
  for (const m of html.matchAll(/class="([^"]+)"/g)) m[1].split(/\s+/).filter((c) => c.startsWith('kvui-')).forEach((c) => used.add(c));
  const defined = new Set([...strip(full).matchAll(/\.(kvui-[\w-]+)/g)].map((m) => m[1]));
  const missing = [...used].filter((c) => !defined.has(c));
  if (missing.length) fail(`docs use classes that don't exist: ${missing.join(', ')}`);
  else ok(`docs page uses ${used.size} classes, all defined`);
}

process.exit(failures ? 1 : 0);
