// Tests for the Material icon builders (no network). Run: node --test test/material-icons.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as M from '../scripts/download-material-icons.mjs';

const fixture = 'home e88a\n\nsearch e8b6\nsettings_ethernet e8e5\n3d_rotation e84d\n';
const entries = M.parseCodepoints(fixture);

test('parses the codepoint catalogue, skipping blank and malformed lines', () => {
  assert.deepEqual(entries, [['home', 'e88a'], ['search', 'e8b6'], ['settings_ethernet', 'e8e5'], ['3d_rotation', 'e84d']]);
  assert.throws(() => M.parseCodepoints('\n\nnot a catalogue'), /unexpected format/);
});

test('each icon has a CSS escape with ONE backslash, so the glyph shows (not the text)', () => {
  const css = M.buildCss(entries);
  assert.ok(css.includes('.nova-icon-home::before{content:"\\e88a "}'), 'single backslash escape');
  assert.ok(!css.includes('content:"\\\\e88a'), 'no doubled backslash');
});

test('names with underscores become dashed class names; digits are allowed after the nova- prefix', () => {
  const css = M.buildCss(entries);
  assert.ok(css.includes('.nova-icon-settings-ethernet::before'));
  assert.ok(css.includes('.nova-icon-3d-rotation::before'));
});

test('the CSS declares the bundled font and the icon classes inside the nova layers', () => {
  const css = M.buildCss(entries);
  assert.ok(css.includes('font-family:"Nova Material Symbols"'));
  assert.ok(css.includes('url("./material-symbols-outlined.woff2")'));
  assert.ok(css.includes('@layer nova.utilities{'));
  assert.ok(css.includes('.nova-icon-filled::before'));
});

test('the names file is a JSON array in catalogue order', () => {
  assert.deepEqual(JSON.parse(M.buildNames(entries)), ['home', 'search', 'settings_ethernet', '3d_rotation']);
});

test('the gallery loads the generated icon CSS and lists every icon', () => {
  const html = M.buildGallery(entries);
  assert.ok(html.includes('href="../dist/icons.css"'), 'icons.css linked');
  assert.ok(html.includes('href="../dist/nova.min.css"'), 'nova css linked');
  assert.ok(html.includes('"home","search","settings_ethernet","3d_rotation"'), 'names embedded');
  assert.ok(html.includes('Search 4 Google Material Symbols'), 'count shown');
});

test('updateMaterialIcons writes every output file using the injected fetch (no network)', async () => {
  const outDir = mkdtempSync(join(tmpdir(), 'mi-'));
  const docsDir = mkdtempSync(join(tmpdir(), 'mi-docs-'));
  const responses = {
    codepoints: fixture,
    font: new Uint8Array([0, 1, 2, 3]),
    license: 'Apache License 2.0',
  };
  const fetchFn = async (url) => {
    const body = url.endsWith('.codepoints') ? responses.codepoints : url.endsWith('.woff2') ? responses.font : responses.license;
    return {
      ok: true,
      status: 200,
      text: async () => body,
      arrayBuffer: async () => (body instanceof Uint8Array ? body.buffer : new TextEncoder().encode(body).buffer),
    };
  };
  const count = await M.updateMaterialIcons({ fetchFn, outDir, docsDir });
  assert.equal(count, 4);
  for (const f of ['material-icons.css', 'material-icon-names.json', 'material-symbols-outlined.woff2', 'MATERIAL_SYMBOLS_LICENSE.txt']) {
    assert.ok(existsSync(join(outDir, f)), f);
  }
  assert.ok(existsSync(join(docsDir, 'icons.html')));
  assert.ok(readFileSync(join(outDir, 'material-icons.css'), 'utf8').includes('.nova-icon-home'));
});

test('a failed download stops with a clear message and writes nothing', async () => {
  const outDir = mkdtempSync(join(tmpdir(), 'mi-fail-'));
  const fetchFn = async () => ({ ok: false, status: 404 });
  await assert.rejects(M.updateMaterialIcons({ fetchFn, outDir, docsDir: outDir }), /Download failed \(404\)/);
  assert.equal(existsSync(join(outDir, 'material-icons.css')), false);
});
