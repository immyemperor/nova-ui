// Usage: node scripts/rename-scope.mjs @acme [ui-prefix]
// Renames the "@omni" npm scope everywhere (package names, imports, docs).
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const next = process.argv[2];
if (!next || !next.startsWith('@')) {
  console.error('Usage: node scripts/rename-scope.mjs @your-scope');
  process.exit(1);
}
const FROM = '@omni';
const SKIP = new Set(['node_modules', 'dist', 'loader', '.git', '.next', '.stencil', '.angular']);
const EXT = /\.(json|ts|tsx|js|mjs|cjs|md|html|css|yaml|yml)$/;

let changed = 0;
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (EXT.test(name)) {
      const src = readFileSync(p, 'utf8');
      if (src.includes(FROM)) {
        writeFileSync(p, src.split(FROM).join(next));
        changed++;
      }
    }
  }
})(process.cwd());
console.log(`Renamed ${FROM} -> ${next} in ${changed} files.`);
