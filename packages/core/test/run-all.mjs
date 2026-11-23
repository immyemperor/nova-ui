// Runs every test file on its own, prints PASS/FAIL per file, and shows the full output of any failure.
// Run: node test/run-all.mjs   (from packages/core)
import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const files = readdirSync(dir).filter((f) => f.endsWith('.test.mjs')).sort();
const failed = [];

for (const f of files) {
  const r = spawnSync(process.execPath, ['--test', join(dir, f)], { encoding: 'utf8' });
  const ok = r.status === 0;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${f}`);
  if (!ok) {
    failed.push(f);
    console.log(r.stdout ?? '');
    console.log(r.stderr ?? '');
  }
}

if (failed.length) {
  console.error(`\n${failed.length} test file(s) failed: ${failed.join(', ')}`);
  process.exit(1);
}
console.log(`\nall ${files.length} test files passed`);
