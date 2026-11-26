// Theme generator tests: the contrast guarantee is the thing to protect. Run: node --test test/theme-generate.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadModule } from './load.mjs';
const G = loadModule('utils/theme-generate.ts');
const C = loadModule('utils/color.ts');

const brands = ['#0b7a6c', '#ff0000', '#ffff00', '#7c3aed', '#f97316', '#ffffff', '#000000', '#808080', '#1e3a8a', '#fde68a'];

for (const brand of brands) {
  test(`${brand}: accent meets 4.5:1 on the light surface and the dark surface`, () => {
    const t = G.generateTheme(brand);
    assert.ok(C.contrastRatio(t.light['--kvui-color-accent'], '#ffffff') >= 4.5, `light ${t.light['--kvui-color-accent']}`);
    assert.ok(C.contrastRatio(t.dark['--kvui-color-accent'], '#141d1a') >= 4.5, `dark ${t.dark['--kvui-color-accent']}`);
  });

  test(`${brand}: text on the accent meets 4.5:1 in both themes`, () => {
    const t = G.generateTheme(brand);
    for (const theme of [t.light, t.dark]) {
      assert.ok(C.contrastRatio(theme['--kvui-color-fg-on-accent'], theme['--kvui-color-accent']) >= 4.5);
    }
  });
}

test('generated colours are valid hex and carry every expected token', () => {
  const t = G.generateTheme('#0b7a6c');
  for (const theme of [t.light, t.dark]) {
    for (const [k, v] of Object.entries(theme)) assert.match(v, /^#[0-9a-f]{6}$/i, `${k}=${v}`);
    for (const key of ['--kvui-color-accent', '--kvui-color-accent-hover', '--kvui-color-accent-active', '--kvui-color-accent-soft', '--kvui-color-fg-on-accent']) assert.ok(key in theme);
  }
});

test('a brand colour that is already accessible is left close to its original value', () => {
  const t = G.generateTheme('#0b7a6c');
  assert.equal(t.light['--kvui-color-accent'], '#0b7a6c', 'already passes on white, so it is not darkened');
});

test('a very light brand colour is darkened for the light theme', () => {
  const t = G.generateTheme('#fde68a');
  assert.notEqual(t.light['--kvui-color-accent'], '#fde68a');
  assert.ok(C.luminance(t.light['--kvui-color-accent']) < C.luminance('#fde68a'));
});

test('hover is darker than the accent (light) and lighter (dark)', () => {
  const t = G.generateTheme('#7c3aed');
  assert.ok(C.luminance(t.light['--kvui-color-accent-hover']) < C.luminance(t.light['--kvui-color-accent']));
  assert.ok(C.luminance(t.dark['--kvui-color-accent-hover']) > C.luminance(t.dark['--kvui-color-accent']));
});

test('invalid input is rejected with a clear message', () => {
  assert.throws(() => G.generateTheme('not-a-colour'), /is not a hex colour/);
});

test('themeToCSS emits both theme blocks', () => {
  const css = G.themeToCSS(G.generateTheme('#0b7a6c'));
  assert.match(css, /:root,\n\[data-theme='light'\] \{/);
  assert.match(css, /\[data-theme='dark'\] \{/);
  assert.match(css, /--kvui-color-accent: #[0-9a-f]{6};/);
});
