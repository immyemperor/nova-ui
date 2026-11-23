// Manual release tool. Same steps as .github/workflows/dist.yml, runnable from a laptop.
//   node scripts/release.mjs check                      build checks (no publishing)
//   node scripts/release.mjs pack                       pack every package into dist-tarballs/
//   node scripts/release.mjs publish [--dry-run] [--tag next] [--otp 123456]
//   node scripts/release.mjs all [--dry-run] [...]      check, pack, then publish
// Publishing uses the packed tarballs, so the Angular package ships its dist/ build, not its source.
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..');
export const DEST = join(repo, 'dist-tarballs');

/** Parse "--flag value" and "--flag" from argv. */
export function parseArgs(argv) {
  const [command = 'help', ...rest] = argv;
  const opts = { command, dryRun: false, tag: undefined, otp: undefined };
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === '--dry-run') opts.dryRun = true;
    else if (rest[i] === '--tag') opts.tag = rest[++i];
    else if (rest[i] === '--otp') opts.otp = rest[++i];
    else throw new Error(`unknown option ${rest[i]}`);
  }
  return opts;
}

/** Which tarballs to publish, and which are already on npm (those are skipped, so a re-run is safe). */
export function planPublish(tarballs, isPublished) {
  return tarballs.map((t) => ({ ...t, action: isPublished(t.name, t.version) ? 'skip' : 'publish' }));
}

/** The npm arguments for one tarball. */
export function publishArgs(file, { tag, otp, dryRun }) {
  const args = ['publish', file, '--access', 'public'];
  if (tag) args.push('--tag', tag);
  if (otp) args.push('--otp', otp);
  if (dryRun) args.push('--dry-run');
  return args;
}

/** Name and version from a tarball's package/package.json (no extraction to disk). */
export function readTarballInfo(file) {
  const json = execFileSync('tar', ['-xzOf', file, 'package/package.json'], { encoding: 'utf8' });
  const pkg = JSON.parse(json);
  return { file, name: pkg.name, version: pkg.version };
}

function publishable() {
  const dir = join(repo, 'packages');
  return readdirSync(dir)
    .map((n) => join(dir, n))
    .filter((p) => statSync(p).isDirectory() && existsSync(join(p, 'package.json')))
    .filter((p) => JSON.parse(readFileSync(join(p, 'package.json'), 'utf8')).private !== true);
}

function run(cmd, args, { cwd = repo, inherit = true } = {}) {
  const r = spawnSync(cmd, args, { cwd, stdio: inherit ? 'inherit' : 'pipe', encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed (exit ${r.status})`);
  return r.stdout ?? '';
}

function isOnNpm(name, version) {
  const r = spawnSync('npm', ['view', `${name}@${version}`, 'version'], { encoding: 'utf8' });
  return r.status === 0 && r.stdout.trim() === version;
}

export function main(argv = process.argv.slice(2)) {
  const opts = parseArgs(argv);
  const steps = {
    check() {
      run('node', ['scripts/verify-publishable.mjs']);
      run('node', ['scripts/verify-dist.mjs']);
    },
    pack() {
      // start empty: a leftover tarball from an earlier build must never be published
      rmSync(DEST, { recursive: true, force: true });
      mkdirSync(DEST, { recursive: true });
      for (const pkgDir of publishable()) {
  const from = existsSync(join(pkgDir, 'dist', 'package.json')) ? join(pkgDir, 'dist') : pkgDir;
  run('pnpm', ['--dir', pkgDir, 'pack', from, '--pack-destination', DEST]);
}
      run('sh', ['-c', `cd "${DEST}" && sha256sum *.tgz > SHA256SUMS.txt`]);
      console.log(`packed into ${DEST}`);
    },
    publish() {
      const files = readdirSync(DEST).filter((f) => f.endsWith('.tgz')).map((f) => join(DEST, f));
      if (!files.length) throw new Error('no tarballs in dist-tarballs/. Run: node scripts/release.mjs pack');
      const plan = planPublish(files.map(readTarballInfo), isOnNpm);
      for (const item of plan) {
        if (item.action === 'skip') { console.log(`skip     ${item.name}@${item.version} (already on npm)`); continue; }
        console.log(`publish  ${item.name}@${item.version}${opts.dryRun ? ' (dry run)' : ''}`);
        run('npm', publishArgs(item.file, opts));
      }
    },
  };
  if (opts.command === 'all') { steps.check(); steps.pack(); steps.publish(); return; }
  if (!steps[opts.command]) {
    console.log('usage: node scripts/release.mjs check | pack | publish [--dry-run] [--tag next] [--otp CODE] | all');
    return;
  }
  steps[opts.command]();
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { main(); } catch (err) { console.error(err.message); process.exit(1); }
}
