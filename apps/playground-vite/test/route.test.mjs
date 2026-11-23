// Route parsing for the explorer. Run: node --test test/route.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const ts = (() => { try { return require('typescript'); } catch { return require('/opt/npm-tools/node_modules/typescript'); } })();
const code = ts.transpileModule(readFileSync(join(here, '..', '..', 'shared', 'react', 'explorer', 'route.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const mod = { exports: {} };
new Function('module', 'exports', 'require', code)(mod, mod.exports, () => ({ useSyncExternalStore() { return ''; } }));
const { parseRoute } = mod.exports;

test('an empty hash or a section anchor shows the catalogue', () => {
  assert.deepEqual(parseRoute(''), { kind: 'catalogue' });
  assert.deepEqual(parseRoute('#forms'), { kind: 'catalogue' });
  assert.deepEqual(parseRoute('#/'), { kind: 'catalogue' });
});

test('a component hash selects that component', () => {
  assert.deepEqual(parseRoute('#/component/ui-button'), { kind: 'component', tag: 'ui-button' });
  assert.deepEqual(parseRoute('#/component/ui-date-range-picker'), { kind: 'component', tag: 'ui-date-range-picker' });
});

test('icon hashes select the Material or Nova browser; Material is the default', () => {
  assert.deepEqual(parseRoute('#/icons'), { kind: 'icons', family: 'material' });
  assert.deepEqual(parseRoute('#/icons/material'), { kind: 'icons', family: 'material' });
  assert.deepEqual(parseRoute('#/icons/nova'), { kind: 'icons', family: 'nova' });
});

test('a component hash with odd text is parsed, and the page then reports an unknown component', () => {
  assert.deepEqual(parseRoute('#/component/'), { kind: 'catalogue' });
  assert.deepEqual(parseRoute('#/component/Bad Tag!'), { kind: 'component', tag: 'Bad' }, 'stops at the first invalid character');
});
