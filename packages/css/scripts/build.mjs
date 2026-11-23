// Bundles src/*.css into dist/. Zero dependencies.
//  - inlines @import (including `layer(name)` imports, which are wrapped in @layer blocks)
//  - writes one file per module, plus nova.css (everything) and nova.min.css
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(root, 'src');
const DIST = join(root, 'dist');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

const LAYER_ORDER = '@layer nova.reset, nova.tokens, nova.base, nova.layout, nova.components, nova.utilities;';
const IMPORT_RE = /@import\s+(?:url\(\s*)?['"]([^'"]+)['"]\s*\)?\s*(?:layer\(\s*([\w.-]+)\s*\))?\s*;/g;

/** Replace each @import with the file's contents (recursively). */
function inline(css, baseDir, stack = []) {
  return css.replace(IMPORT_RE, (_m, href, layer) => {
    if (/^(https?:)?\/\//.test(href)) return _m; // leave remote imports alone
    const file = resolve(baseDir, href);
    if (stack.includes(file)) throw new Error(`Circular @import: ${[...stack, file].join(' -> ')}`);
    let body;
    try {
      body = readFileSync(file, 'utf8');
    } catch {
      throw new Error(`Cannot read ${file} (imported from ${baseDir})`);
    }
    body = inline(body, dirname(file), [...stack, file]);
    return layer ? `@layer ${layer} {\n${body}\n}` : body;
  });
}

/** Keep the first layer-order statement, drop the repeats every module carries. */
function dedupeLayerOrder(css) {
  let seen = false;
  return css.replace(/@layer nova\.reset,[^;]*;\s*/g, (m) => (seen ? '' : ((seen = true), m)));
}

/**
 * Conservative minifier: strips comments and redundant whitespace.
 * Strings are protected, and spaces around + and - are kept (they are operators inside calc()).
 */
function minify(css) {
  const strings = [];
  let out = css
    .replace(/\/\*(?!!)[\s\S]*?\*\//g, '')
    .replace(/("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')/g, (m) => `\u0000${strings.push(m) - 1}\u0000`)
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,>~])\s*/g, '$1')
    .replace(/:\s+/g, ':')
    .replace(/;}/g, '}')
    .replace(/\s*!important/g, '!important')
    .trim();
  out = out.replace(/\u0000(\d+)\u0000/g, (_m, i) => strings[Number(i)]);
  return out;
}

/**
 * Browsers without cascade-layer support (before 2022) ignore every @layer block, so nothing would apply.
 * This removes the layer wrappers. Rule order already matches layer order, so Nova's own precedence is kept;
 * what you lose is "your CSS always wins", so you rely on source order and specificity instead.
 */
function unlayer(css) {
  const src = css.replace(/\/\*[\s\S]*?\*\//g, '');
  let out = '';
  let depth = 0;
  const layerDepths = [];
  for (let i = 0; i < src.length; i++) {
    if (src.startsWith('@layer', i)) {
      const semi = src.indexOf(';', i);
      const brace = src.indexOf('{', i);
      if (semi !== -1 && (brace === -1 || semi < brace)) { i = semi; continue; } // "@layer a, b;" statement
      layerDepths.push(depth); // block: drop the header, keep the contents
      depth++;
      i = brace;
      continue;
    }
    const ch = src[i];
    if (ch === '{') { depth++; out += ch; }
    else if (ch === '}') {
      depth--;
      if (layerDepths.length && layerDepths[layerDepths.length - 1] === depth) layerDepths.pop();
      else out += ch;
    } else out += ch;
  }
  return out;
}

const banner = `/*! ${pkg.name} v${pkg.version} | MIT | mobile-first, cascade-layered CSS */\n`;

const entries = {
  nova: readFileSync(join(SRC, 'index.css'), 'utf8'),
  tokens: `@import url('../../core/src/global/tokens.css') layer(nova.tokens);\n@import url('./tokens.css');`,
  reset: `@import url('./reset.css');`,
  typography: `@import url('./typography.css');`,
  layout: `@import url('./layout.css');`,
  components: `@import url('./components.css');`,
  utilities: `@import url('./generated/utilities.css');\n@import url('./print.css');`,
  print: `@import url('./print.css');`,
};

mkdirSync(DIST, { recursive: true });
const rows = [];
for (const [name, source] of Object.entries(entries)) {
  const css = banner + dedupeLayerOrder(inline(source, SRC)).replace(/\n{3,}/g, '\n\n').trim() + '\n';
  writeFileSync(join(DIST, `${name}.css`), css);
  let min = null;
  let compat = null;
  if (name === 'nova') {
    min = banner + minify(css.replace(banner, '')) + '\n';
    writeFileSync(join(DIST, 'nova.min.css'), min);
    compat = `/*! ${pkg.name} v${pkg.version} | compat build: no cascade layers (for browsers older than 2022) */\n` + minify(unlayer(css)) + '\n';
    writeFileSync(join(DIST, 'nova.compat.css'), compat);
  }
  rows.push([`${name}.css`, css.length, gzipSync(css).length]);
  if (min) rows.push(['nova.min.css', min.length, gzipSync(min).length]);
  if (compat) rows.push(['nova.compat.css', compat.length, gzipSync(compat).length]);
}

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
console.log('file'.padEnd(18), 'size'.padStart(10), 'gzip'.padStart(10));
for (const [f, size, gz] of rows) console.log(f.padEnd(18), kb(size).padStart(10), kb(gz).padStart(10));

// ---- Material icons (generated by scripts/download-material-icons.mjs, optional) ----
// Copied into dist/ only when they have been generated, so the build works before `icons:update` has run.
import { existsSync, copyFileSync } from 'node:fs';
const generatedDir = join(root, 'src', 'generated');
const iconFiles = [
  ['material-icons.css', 'icons.css'],
  ['material-icon-names.json', 'material-icon-names.json'],
  ['material-symbols-outlined.woff2', 'material-symbols-outlined.woff2'],
  ['MATERIAL_SYMBOLS_LICENSE.txt', 'MATERIAL_SYMBOLS_LICENSE.txt'],
];
const copied = [];
for (const [from, to] of iconFiles) {
  const src = join(generatedDir, from);
  if (existsSync(src)) { copyFileSync(src, join(DIST, to)); copied.push(to); }
}
console.log(copied.length
  ? `icons: ${copied.length} files copied to dist (${copied.join(', ')})`
  : 'icons: not generated yet. Run pnpm --filter @omni/css icons:update to add Material Symbols.');
