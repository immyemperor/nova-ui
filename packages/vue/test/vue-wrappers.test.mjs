// The generated Vue wrappers must parse and cover every component. Run: node --test test/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const ts = (() => { try { return require('typescript'); } catch { return require('/opt/npm-tools/node_modules/typescript'); } })();
const src = readFileSync(join(here, '..', 'src', 'components.ts'), 'utf8');
const manifest = JSON.parse(readFileSync(join(here, '..', '..', 'core', 'dist-docs', 'custom-elements.json'), 'utf8'));
const tags = manifest.modules.flatMap((m) => m.declarations.map((d) => d.tagName));

test('the generated file parses with no syntax errors', () => {
  const sf = ts.createSourceFile('components.ts', src, ts.ScriptTarget.ES2020, true, ts.ScriptKind.TS);
  const diags = sf.parseDiagnostics ?? [];
  assert.equal(diags.length, 0, diags.map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n')).join('; '));
});

test('every component has a wrapper that renders its real tag', () => {
  for (const tag of tags) {
    const name = tag.split('-').map((p) => p[0].toUpperCase() + p.slice(1)).join('');
    assert.ok(src.includes(`export const ${name} = defineComponent`), `missing ${name}`);
    assert.ok(src.includes(`h('${tag}'`), `missing render of ${tag}`);
  }
});

test('events become emitted events with onUi listeners', () => {
  assert.ok(src.includes("'uiChange'"));
  assert.ok(src.includes('onUiChange:'));
});
