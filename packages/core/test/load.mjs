// Shared test helper: transpile a src/*.ts file and its relative imports into a CommonJS graph.
// Lets the real source run under node:test without a bundler. Used by the logic tests.
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(here, '..', 'src');
const require = createRequire(import.meta.url);
const ts = (() => { try { return require('typescript'); } catch { return require('/opt/npm-tools/node_modules/typescript'); } })();

export function loadModule(rel, cache = new Map()) {
  const file = resolve(SRC, rel.endsWith('.ts') ? rel : rel + '.ts');
  if (cache.has(file)) return cache.get(file).exports;
  const code = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const mod = { exports: {} };
  cache.set(file, mod);
  const localRequire = (spec) => {
    if (spec.startsWith('.')) return loadModule(join(dirname(file), spec).replace(SRC + '/', ''), cache);
    return require(spec);
  };
  new Function('module', 'exports', 'require', code)(mod, mod.exports, localRequire);
  return mod.exports;
}
