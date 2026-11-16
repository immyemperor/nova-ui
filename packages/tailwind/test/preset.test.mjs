// The Tailwind preset must only reference tokens that really exist. Run: node --test test/preset.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const preset = require(join(here, '..', 'index.js'));
const tokens = readFileSync(join(here, '..', '..', 'css', 'dist', 'nova.css'), 'utf8');
const defined = new Set([...tokens.matchAll(/(--nova-[\w-]+):/g)].map((m) => m[1]));

function allVars(obj, out = []) {
  for (const v of Object.values(obj)) typeof v === 'object' ? allVars(v, out) : out.push(v);
  return out;
}

test('every var() the preset references is a defined Nova token', () => {
  const refs = allVars(preset.theme.extend).flatMap((s) => [...String(s).matchAll(/var\((--nova-[\w-]+)\)/g)].map((m) => m[1]));
  assert.ok(refs.length >= 25, `expected at least 25 references, got ${refs.length}`);
  const missing = [...new Set(refs)].filter((r) => !defined.has(r));
  assert.deepEqual(missing, [], `tokens not defined in nova.css: ${missing}`);
});

test('colour names match the components they style', () => {
  for (const name of ['accent', 'surface', 'fg', 'muted', 'danger', 'on-accent']) assert.ok(name in preset.theme.extend.colors.nova, name);
});

test('the preset is a valid Tailwind preset shape', () => {
  assert.equal(typeof preset.theme, 'object');
  assert.equal(typeof preset.theme.extend, 'object');
});
