// Run: node --test scripts/verify-dist.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { entryPaths, packDir, verify, OPTIONAL } from './verify-dist.mjs';

test('collects every relative path from main, types, exports and nested conditions', () => {
  const paths = entryPaths({
    main: './dist/index.cjs',
    types: './dist/types/index.d.ts',
    exports: { '.': { types: './dist/index.d.ts', import: './dist/index.js' }, './styles.css': './dist/kvui.css', './x': null },
    name: 'ignored',
  });
  assert.deepEqual(paths.sort(), ['./dist/index.cjs', './dist/index.d.ts', './dist/index.js', './dist/kvui.css', './dist/types/index.d.ts'].sort());
});

test('bare file names (main: "index.js") and glob patterns are handled', () => {
  const paths = entryPaths({ main: 'index.js', exports: { './components/*': './dist/components/*' } });
  assert.deepEqual(paths, ['./index.js']);
});

test('a package with a build folder is packed from dist/', () => {
  const pkg = mkdtempSync(join(tmpdir(), 'pkg-'));
  assert.equal(packDir(pkg), pkg);
  mkdirSync(join(pkg, 'dist'));
  writeFileSync(join(pkg, 'dist', 'package.json'), '{}');
  assert.equal(packDir(pkg), join(pkg, 'dist'));
});

test('verify reports a missing required entry and treats optional icon files as warnings', () => {
  const root = mkdtempSync(join(tmpdir(), 'verify-'));
  const pkgDir = join(root, 'css');
  mkdirSync(join(pkgDir, 'dist'), { recursive: true });
  writeFileSync(join(pkgDir, 'package.json'), JSON.stringify({
    name: '@x/css',
    exports: { '.': './dist/kvui.css', './icons.css': './dist/icons.css' },
  }));
  writeFileSync(join(pkgDir, 'dist', 'kvui.css'), '');
  // kvui.css exists; icons.css is optional, so it is a warning
  const { problems, warnings } = verify([pkgDir]);
  assert.deepEqual(problems, []);
  assert.equal(warnings.length, 1);
  assert.ok(warnings[0].includes('./dist/icons.css'));
  assert.ok(OPTIONAL.has('./dist/icons.css'));
});

test('verify fails when a required entry is missing', () => {
  const root = mkdtempSync(join(tmpdir(), 'verify-bad-'));
  const pkgDir = join(root, 'core');
  mkdirSync(pkgDir);
  writeFileSync(join(pkgDir, 'package.json'), JSON.stringify({ name: '@x/core', main: './dist/index.cjs' }));
  const { problems } = verify([pkgDir]);
  assert.equal(problems.length, 1);
  assert.ok(problems[0].includes('./dist/index.cjs is missing'));
});

test('private packages are skipped', () => {
  const root = mkdtempSync(join(tmpdir(), 'verify-priv-'));
  writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'playground', private: true, main: './missing.js' }));
  assert.deepEqual(verify([root]), { problems: [], warnings: [] });
});
