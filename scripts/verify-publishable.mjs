// Every package under packages/ must ship: public, scoped to @nova-ui, versioned together, and packable.
//   node scripts/verify-publishable.mjs     (exits non-zero on any problem)
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Problems with one package.json, given the changeset fixed group. Empty when the package ships. */
export function publishProblems(pkg, fixedGroup) {
  const problems = [];
  if (pkg.private) problems.push(`${pkg.name} is private, so it would not ship`);
  if (!String(pkg.name).startsWith('@nova-ui/')) problems.push(`${pkg.name} is not in the @nova-ui scope`);
  if (pkg.publishConfig?.access !== 'public') problems.push(`${pkg.name} has no publishConfig.access "public" (scoped packages are private by default)`);
  if (!pkg.version) problems.push(`${pkg.name} has no version`);
  if (!fixedGroup.includes(pkg.name)) problems.push(`${pkg.name} is not in the changeset fixed group, so its version can drift`);
  if (!pkg.license) problems.push(`${pkg.name} has no license`);
  // workspace: references are only meaningful inside the monorepo; peers must be real semver ranges for installers
  for (const [dep, range] of Object.entries(pkg.peerDependencies ?? {})) {
    if (String(range).startsWith('workspace:')) problems.push(`${pkg.name} peer ${dep} uses "${range}", which installers cannot resolve`);
  }
  // npm provenance checks that the package names the repository the workflow runs in
  if (!pkg.repository?.url) problems.push(`${pkg.name} has no repository (npm provenance needs it)`);
  return problems;
}

export function verify(repoDir = repo) {
  const config = JSON.parse(readFileSync(join(repoDir, '.changeset/config.json'), 'utf8'));
  const fixedGroup = config.fixed.flat();
  const dir = join(repoDir, 'packages');
  const problems = [];
  const names = [];
  for (const name of readdirSync(dir)) {
    const pkgDir = join(dir, name);
    if (!statSync(pkgDir).isDirectory() || !existsSync(join(pkgDir, 'package.json'))) continue;
    const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'));
    names.push(pkg.name);
    problems.push(...publishProblems(pkg, fixedGroup));
  }
  return { problems, names };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { problems, names } = verify();
  for (const p of problems) console.error('FAIL ', p);
  if (problems.length) { console.error(`\n${problems.length} problem(s): not every package would ship`); process.exit(1); }
  console.log(`all ${names.length} packages ship: ${names.join(', ')}`);
}
