// Generated docs and editor data must cover every component and be well-formed. Run: node --test test/docs.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(root, 'dist-docs/custom-elements.json'), 'utf8'));
const vscode = JSON.parse(readFileSync(join(root, 'dist-docs/vscode-html-data.json'), 'utf8'));
const tagsInSource = [join(root, 'src/components'), join(root, '../editor/src/components')]
  .flatMap((dir) => readdirSync(dir, { recursive: true }).filter((f) => String(f).endsWith('.tsx')).map((f) => readFileSync(join(dir, String(f)), 'utf8').match(/tag:\s*'([^']+)'/)?.[1]))
  .filter(Boolean);

test('every component appears in the manifest and the editor data', () => {
  const manifestTags = manifest.modules.flatMap((m) => m.declarations.map((d) => d.tagName));
  const editorTags = vscode.tags.map((t) => t.name);
  assert.deepEqual([...manifestTags].sort(), [...tagsInSource].sort());
  assert.deepEqual([...editorTags].sort(), [...tagsInSource].sort());
});

test('enum props list their allowed values for autocomplete', () => {
  const button = vscode.tags.find((t) => t.name === 'ui-button');
  const variant = button.attributes.find((a) => a.name === 'variant');
  assert.deepEqual(variant.values.map((v) => v.name), ['primary', 'secondary', 'ghost', 'danger']);
});

test('events are exposed as on<Name> attributes for editors', () => {
  const pick = vscode.tags.find((t) => t.name === 'ui-date-picker');
  assert.ok(pick.attributes.some((a) => a.name === 'onUiChange'));
});

test('the chart component documents its series prop', () => {
  const chart = manifest.modules.flatMap((m) => m.declarations).find((d) => d.tagName === 'ui-chart');
  const series = chart.attributes.find((a) => a.name === 'series');
  assert.ok(series, 'series attribute present');
});

test('every prop has a type; nothing is left blank', () => {
  for (const m of manifest.modules) for (const d of m.declarations) for (const a of d.attributes) {
    assert.ok(a.type?.text, `${d.tagName} ${a.name} has no type`);
  }
});
