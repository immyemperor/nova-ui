// Unit tests for the framework-free logic in @kvui/core. Run: node --test test/
// These files are TypeScript; we compile them with the TypeScript transpiler (no bundler needed).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, '..', 'src');
const require = createRequire(import.meta.url);

// Locate TypeScript: prefer the workspace copy, then anything on the path.
function loadTs() {
  for (const p of [join(here, '..', 'node_modules', 'typescript'), '/opt/npm-tools/node_modules/typescript']) {
    if (existsSync(join(p, 'package.json'))) return require(p);
  }
  return null;
}
const ts = loadTs();
if (!ts) { console.log('SKIP: TypeScript not found'); process.exit(0); }

// Transpile a source file to a CommonJS module in a temp dir and require it.
const cache = new Map();
function load(relPath) {
  if (cache.has(relPath)) return cache.get(relPath);
  const code = ts.transpileModule(readFileSync(join(src, relPath), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  const dir = mkdtempSync(join(tmpdir(), 'nova-test-'));
  // Rewrite relative imports to the temp dir layout by stubbing the few we need.
  const stubbed = code
    .replace(/require\("\.\/(\w+)"\)/g, (_m, n) => `require("${join(dirname(join(src, relPath)), n)}.js")`);
  const file = join(dirname(join(src, relPath)), `.__test_${relPath.replace(/\//g, '_')}.cjs`);
  writeFileSync(file, stubbed);
  try { const mod = require(file); cache.set(relPath, mod); return mod; }
  finally { try { require('node:fs').unlinkSync(file); } catch {} }
}

/* ---------- i18n ---------- */
test('t() returns English defaults and fills placeholders', () => {
  const { t, setMessages, resetMessages } = load('i18n/messages.ts');
  resetMessages();
  assert.equal(t('close'), 'Close');
  assert.equal(t('showingRange', { from: 1, to: 10, total: 87 }), 'Showing 1\u201310 of 87');
  assert.equal(t('pageN', { n: 4 }), 'Page 4');
});

test('setMessages overrides a key and leaves the rest in English', () => {
  const { t, setMessages, resetMessages } = load('i18n/messages.ts');
  resetMessages();
  setMessages({ close: 'Fermer' });
  assert.equal(t('close'), 'Fermer');
  assert.equal(t('dismiss'), 'Dismiss');
  resetMessages();
});

test('placeholders are filled everywhere they appear, not just once', () => {
  const { t, setMessages, resetMessages } = load('i18n/messages.ts');
  resetMessages();
  setMessages({ themeNow: 'Thema {current}, wechsle zu {next}, {current}' });
  assert.equal(t('themeNow', { current: 'Dark', next: 'Light' }), 'Thema Dark, wechsle zu Light, Dark');
  resetMessages();
});

test('every t() key used in the components exists in the catalogue', () => {
  const { DEFAULT_MESSAGES } = load('i18n/messages.ts');
  const { readdirSync, statSync } = require('node:fs');
  const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
  const files = walk(join(src, 'components')).filter((f) => f.endsWith('.tsx'));
  const used = new Set();
  for (const f of files) for (const m of readFileSync(f, 'utf8').matchAll(/\bt\('(\w+)'/g)) used.add(m[1]);
  const unknown = [...used].filter((k) => !(k in DEFAULT_MESSAGES));
  assert.deepEqual(unknown, [], `unknown message keys: ${unknown}`);
  assert.ok(used.size >= 25, `expected many translated strings, found ${used.size}`);
});

/* ---------- date maths ---------- */
test('parseISO accepts real dates and rejects impossible ones', () => {
  const { parseISO } = load('utils/date.ts');
  assert.ok(parseISO('2026-02-28'));
  assert.equal(parseISO('2025-02-29'), undefined, 'not a leap year');
  assert.ok(parseISO('2028-02-29'), 'leap year');
  assert.equal(parseISO('2026-13-01'), undefined);
  assert.equal(parseISO('26-01-01'), undefined);
  assert.equal(parseISO(''), undefined);
});

test('addMonths clamps the day to the end of a shorter month', () => {
  const { addMonths, toISO, parseISO } = load('utils/date.ts');
  assert.equal(toISO(addMonths(parseISO('2026-01-31'), 1)), '2026-02-28');
  assert.equal(toISO(addMonths(parseISO('2028-01-31'), 1)), '2028-02-29');
  assert.equal(toISO(addMonths(parseISO('2026-03-15'), -2)), '2026-01-15');
});

test('monthGrid is 6x7 and starts on the requested weekday', () => {
  const { monthGrid, toISO } = load('utils/date.ts');
  const sun = monthGrid(2026, 10, 0); // November 2026 starts on a Sunday
  assert.equal(sun.length, 6); assert.ok(sun.every((w) => w.length === 7));
  assert.equal(toISO(sun[0][0]), '2026-11-01');
  const mon = monthGrid(2026, 10, 1); // weeks start on Monday, so the grid begins Mon 26 Oct
  assert.equal(toISO(mon[0][0]), '2026-10-26');
});

test('clampISO keeps a date inside min and max', () => {
  const { clampISO } = load('utils/date.ts');
  assert.equal(clampISO('2026-01-01', '2026-03-01', '2026-06-01'), '2026-03-01');
  assert.equal(clampISO('2026-12-01', '2026-03-01', '2026-06-01'), '2026-06-01');
  assert.equal(clampISO('2026-04-01', '2026-03-01', '2026-06-01'), '2026-04-01');
});

/* ---------- colour ---------- */
test('hex <-> HSV round-trips within rounding', () => {
  const { hexToHsv, hsvToHex, normaliseHex } = load('utils/color.ts');
  for (const hex of ['#0b7a6c', '#ff0000', '#00ff00', '#123456', '#ffffff', '#000000', '#808080']) {
    assert.equal(hsvToHex(hexToHsv(hex)), hex, hex);
  }
  assert.equal(normaliseHex('#ABC'), '#aabbcc');
  assert.equal(normaliseHex('zzz'), undefined);
});

test('readableOn picks black on light colours and white on dark ones', () => {
  const { readableOn } = load('utils/color.ts');
  assert.equal(readableOn('#ffffff'), '#000000');
  assert.equal(readableOn('#fde68a'), '#000000');
  assert.equal(readableOn('#0b7a6c'), '#ffffff');
  assert.equal(readableOn('#000000'), '#ffffff');
});

/* ---------- fuzzy search ---------- */
test('fuzzyScore: substring beats scattered letters, earlier beats later', () => {
  const { fuzzyScore } = load('utils/search.ts');
  const exact = fuzzyScore('save', 'Save file');
  const scattered = fuzzyScore('save', 'Shift + A + V + E');
  assert.ok(exact > scattered, `${exact} > ${scattered}`);
  assert.ok(fuzzyScore('sa', 'Save') > fuzzyScore('sa', 'Load and save'));
  assert.equal(fuzzyScore('xyz', 'Save'), 0, 'no match');
  assert.equal(fuzzyScore('', 'anything'), 1, 'empty query matches everything');
});

test('matchHotkey: mod is Ctrl or Meta; modifiers must match exactly', () => {
  const { matchHotkey } = load('utils/search.ts');
  const ev = (o) => ({ key: 'k', ctrlKey: false, metaKey: false, altKey: false, shiftKey: false, ...o });
  assert.ok(matchHotkey(ev({ key: 'k', ctrlKey: true }), 'mod+k'));
  assert.ok(matchHotkey(ev({ key: 'k', metaKey: true }), 'mod+k'));
  assert.ok(!matchHotkey(ev({ key: 'k' }), 'mod+k'));
  assert.ok(!matchHotkey(ev({ key: 'k', ctrlKey: true, shiftKey: true }), 'mod+k'), 'extra shift must not match');
  assert.ok(matchHotkey(ev({ key: 'p', ctrlKey: true, shiftKey: true }), 'ctrl+shift+p'));
});

/* ---------- positioning ---------- */
test('computePosition flips to the opposite side when there is no room', () => {
  const { computePosition } = load('utils/position.ts');
  globalThis.document = { documentElement: { clientWidth: 1000, clientHeight: 800 } };
  const low = { top: 760, bottom: 780, left: 100, right: 200, width: 100, height: 20 }; // near the bottom edge
  const r = computePosition(low, { width: 150, height: 200 }, 'bottom-start', 8);
  assert.equal(r.placement, 'top-start', 'flipped above');
  assert.ok(r.y + 200 <= 800, 'stays inside the viewport');
  delete globalThis.document;
});

test('computePosition keeps the panel inside the viewport horizontally', () => {
  const { computePosition } = load('utils/position.ts');
  globalThis.document = { documentElement: { clientWidth: 400, clientHeight: 800 } };
  const edge = { top: 100, bottom: 120, left: 380, right: 395, width: 15, height: 20 };
  const r = computePosition(edge, { width: 300, height: 100 }, 'bottom-end', 8);
  assert.ok(r.x >= 8 && r.x + 300 <= 392, `x=${r.x}`);
  delete globalThis.document;
});

/* ---------- editor helpers (safe URLs) ---------- */
test('safeHref blocks script-capable schemes and allows web links', () => {
  const src2 = readFileSync(join(here, '..', '..', 'editor', 'src', 'components', 'ui-editor', 'uploads.ts'), 'utf8');
  const out = ts.transpileModule(src2, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const m = { exports: {} };
  new Function('module', 'exports', 'require', out)(m, m.exports, require);
  const { safeHref, safeImageSrc } = m.exports;
  assert.equal(safeHref('javascript:alert(1)'), undefined);
  assert.equal(safeHref('JaVaScRiPt:alert(1)'), undefined);
  assert.equal(safeHref('data:text/html,<script>'), undefined);
  assert.equal(safeHref('vbscript:x'), undefined);
  assert.equal(safeHref('https://example.com'), 'https://example.com');
  assert.equal(safeHref('example.com'), 'https://example.com');
  assert.equal(safeHref('mailto:a@b.co'), 'mailto:a@b.co');
  assert.equal(safeImageSrc('data:text/html;base64,xx'), undefined, 'only data:image/* is allowed');
  assert.equal(safeImageSrc('data:image/png;base64,xx'), 'data:image/png;base64,xx');
});

test('acceptsFile matches extensions, wildcards and exact MIME types', () => {
  const src2 = readFileSync(join(here, '..', '..', 'editor', 'src', 'components', 'ui-editor', 'uploads.ts'), 'utf8');
  const out = ts.transpileModule(src2, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const m = { exports: {} };
  new Function('module', 'exports', 'require', out)(m, m.exports, require);
  const { acceptsFile } = m.exports;
  const f = (name, type) => ({ name, type });
  assert.ok(acceptsFile(f('a.PNG', 'image/png'), 'image/*'));
  assert.ok(!acceptsFile(f('a.pdf', 'application/pdf'), 'image/*'));
  assert.ok(acceptsFile(f('report.pdf', 'application/pdf'), '.pdf,.zip'));
  assert.ok(acceptsFile(f('x.anything', ''), ''), 'empty accept allows everything');
  assert.ok(acceptsFile(f('a.pdf', 'application/pdf'), 'application/pdf'));
});

test('formatBytes produces readable sizes', () => {
  const src2 = readFileSync(join(here, '..', '..', 'editor', 'src', 'components', 'ui-editor', 'uploads.ts'), 'utf8');
  const out = ts.transpileModule(src2, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const m = { exports: {} };
  new Function('module', 'exports', 'require', out)(m, m.exports, require);
  assert.equal(m.exports.formatBytes(512), '512 B');
  assert.equal(m.exports.formatBytes(2048), '2 KB');
  assert.equal(m.exports.formatBytes(5 * 1024 * 1024), '5.0 MB');
});
