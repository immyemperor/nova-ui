// Icon library rules. Run: node --test test/icons.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadModule } from './load.mjs';
const I = loadModule('components/ui-icon/icons.ts');
const here = dirname(fileURLToPath(import.meta.url));

test('kvui library is the default: no icon uses the Material font', () => {
  I.setIconLibrary('kvui');
  assert.equal(I.usesMaterial('check'), false);
});

test('material library maps Kvui names to Material ligatures', () => {
  I.setIconLibrary('material');
  assert.equal(I.usesMaterial('check'), true);
  assert.equal(I.materialName('x'), 'close');
  assert.equal(I.materialName('chevron-down'), 'expand_more');
  I.setIconLibrary('kvui');
});

test('a per-icon override beats the page setting', () => {
  I.setIconLibrary('kvui');
  assert.equal(I.usesMaterial('check', 'material'), true);
  I.setIconLibrary('material');
  assert.equal(I.usesMaterial('check', 'kvui'), false);
  I.setIconLibrary('kvui');
});

test('a custom registered SVG keeps its drawing in material mode unless it is mapped', () => {
  I.setIconLibrary('material');
  I.registerIcons({ 'brand-mark': '<path d="M0 0h24v24H0z"/>' });
  assert.equal(I.usesMaterial('brand-mark'), false, 'registered SVG stays SVG');
  assert.equal(I.usesMaterial('some-unknown-name'), true, 'unknown names fall back to a Material ligature');
  I.setIconLibrary('kvui');
});

test('every icon name used literally by the components has a Material mapping or a Kvui drawing', () => {
  const dir = join(here, '..', 'src', 'components');
  const files = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? files(join(d, f)) : [join(d, f)]));
  const used = new Set();
  for (const f of files(dir).filter((f) => f.endsWith('.tsx'))) {
    for (const m of readFileSync(f, 'utf8').matchAll(/<ui-icon[^>]*\bname="([^"]+)"/g)) used.add(m[1]);
  }
  const unmapped = [...used].filter((n) => !(n in I.MATERIAL_NAMES));
  // Names with a Kvui drawing still render in kvui mode; names without one must be mapped.
  const { getIcon } = I;
  const broken = unmapped.filter((n) => !getIcon(n));
  assert.deepEqual(broken, [], `icons used by components but neither mapped nor drawn: ${broken}`);
  // Literal names only: components that pick icons from a map (e.g. the theme toggle) are not visible to this scan.
  assert.ok(used.size >= 8, `expected at least 8 literal icon names, found ${used.size}`);
});
