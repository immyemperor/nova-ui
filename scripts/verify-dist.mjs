// Checks that every publishable package has its built entry points before it is packed.
//   node scripts/verify-dist.mjs            (exits non-zero if anything required is missing)
// A package is packed from its build folder when it has one (Angular: dist/), otherwise from its own folder.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Every "./..." path a package.json points at, from main, module, types, style, bin and exports. */
export function entryPaths(pkg) {
  const out = new Set();
  const visit = (v) => {
    // "index.js" and "./index.js" name the same file; glob patterns ("*") are not files, so they are skipped
    if (typeof v === 'string' && !v.includes('*') && (v.startsWith('./') || /^[\w@-][\w./@-]*\.\w+$/.test(v))) out.add(v.startsWith('./') ? v : `./${v}`);
    else if (Array.isArray(v)) v.forEach(visit);
    else if (v && typeof v === 'object') Object.values(v).forEach(visit);
  };
  for (const key of ['main', 'module', 'types', 'typings', 'style', 'bin', 'exports']) visit(pkg[key]);
  return [...out];
}

/** Files that exist only when optional generation has run (Material icons). Missing ones are reported, not fatal. */
export const OPTIONAL = new Set(['./dist/icons.css', './dist/material-icon-names.json', './dist/material-symbols-outlined.woff2']);

/** The folder a package is packed from: its build output when there is one, otherwise the package itself. */
export function packDir(pkgDir) {
  return existsSync(join(pkgDir, 'dist', 'package.json')) ? join(pkgDir, 'dist') : pkgDir;
}

function packages() {
  const dir = join(repo, 'packages');
  return readdirSync(dir).map((name) => join(dir, name)).filter((p) => statSync(p).isDirectory() && existsSync(join(p, 'package.json')));
}

export function verify(pkgDirs = packages()) {
  const problems = [];
  const warnings = [];
  for (const pkgDir of pkgDirs) {
    const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'));
    if (pkg.private) continue;
    const from = packDir(pkgDir);
    const built = from !== pkgDir;
    const entries = entryPaths(pkg);
    if (!entries.length && !built) {
      problems.push(`${pkg.name}: no entry points and no build folder`);
      continue;
    }
    for (const entry of entries) {
      // entry paths are relative to the packed folder; a built package has its own package.json there
      const rel = built ? entry.replace(/^\.\/dist\//, './') : entry;
      if (existsSync(join(from, rel))) continue;
      (OPTIONAL.has(entry) ? warnings : problems).push(`${pkg.name}: ${entry} is missing (${built ? 'built' : 'source'} folder)`);
    }
    if (built && !existsSync(join(from, 'package.json'))) problems.push(`${pkg.name}: build folder has no package.json`);
  }
  return { problems, warnings };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { problems, warnings } = verify();
  for (const w of warnings) console.warn('warn ', w);
  for (const p of problems) console.error('FAIL ', p);
  if (problems.length) { console.error(`\n${problems.length} package(s) are not ready to pack`); process.exit(1); }
  console.log('all publishable packages have their entry points');
}
