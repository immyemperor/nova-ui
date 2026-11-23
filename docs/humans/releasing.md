# Releasing Nova UI

This is the release document for maintainers. It contains the steps for a release, both by hand and through GitHub Actions, the checks that must pass, and what the release ships to users.

Two companion documents go deeper:

- [release-manual.md](release-manual.md): the long-form runbook, with troubleshooting for each step.
- [docs/users/releases.md](../users/releases.md): the guide for developers who install and upgrade Nova, shared with users.

## 1. What is released

Seven packages, always together, always at the same version. They are versioned as one group through the changeset fixed group in `.changeset/config.json`.

| Package | Ships | Built into |
| --- | --- | --- |
| `@kvui/core` | Web components, tokens, theme, utilities, API reference (`dist-docs/`) | `dist/`, `loader/` |
| `@kvui/css` | Layout, utilities, CSS components, Material icons (when generated) | `dist/` |
| `@kvui/react` | React wrappers, hooks, page blocks, `/editor` and `/server` entries | `dist/` |
| `@kvui/angular` | Angular standalone wrappers and services | `dist/` (ng-packagr; packed from there) |
| `@kvui/vue` | Vue 3 wrappers | `dist/` |
| `@kvui/editor` | Rich text editor (Tiptap) | `dist/`, `loader/` |
| `@kvui/tailwind` | Tailwind preset | `index.js` |

The playgrounds under `apps/` are private and never released.

`scripts/verify-publishable.mjs` fails the build if a package would not ship: if it is private, outside the `@omni` scope, missing public access, a repository or a licence, outside the fixed group, or has a `workspace:` peer reference.

## 2. Version policy

- **Patch** (`0.2.0` to `0.2.1`): bug fixes and internal changes that don't change the public API.
- **Minor** (`0.2.0` to `0.3.0`): new components, props, events or tokens. Existing code keeps working.
- **Major** (`0.x` to `1.0.0` and later): removed or renamed props, events, tokens or classes; changed defaults that alter output.

Before 1.0, a minor release may still rename something, but the changelog must say so and give the replacement. After 1.0, an API is deprecated in one release and removed no earlier than the next major release, with a console warning in between. Nova does not yet print deprecation warnings, so the changelog is the only notice.

Every change that affects users needs a changeset (`pnpm changeset`). Breaking changes say what to do instead.

## 3. One-time setup

1. **npm.** Log in at npmjs.com with two-factor authentication turned on. Make sure the `@omni` organisation exists and you are a member with publish rights.
2. **Token for CI.** Create an npm automation token with publish rights for `@omni`, and add it to the GitHub repository as the secret `NPM_TOKEN`.
3. **Optional approval.** Create a GitHub environment named `npm` with required reviewers, so each publish is approved.
4. **Local tools.** Node 20 or newer, pnpm 9 (the version in `package.json`), and the GitHub CLI (`gh`) if you will create releases from the terminal.
5. **Local login.** `npm login`, then `npm whoami` to confirm.

## 4. Before you start

- [ ] You are on `main`, up to date, with a clean tree: `git checkout main && git pull && git status`.
- [ ] Every change to release has a changeset: `ls .changeset/*.md`.
- [ ] CI is green on `main`.

## 5. Release by hand

Use this route when GitHub Actions is unavailable, for a first release, or in an emergency.

### Step 1: apply the versions

```bash
pnpm version-packages
git diff --stat
grep '"version"' packages/*/package.json      # all seven must show the same new version
git add -A && git commit -m "chore: release $(node -p "require('./packages/core/package.json').version")"
```

If the seven versions differ, stop and check the changeset files.

### Step 2: install cleanly and build

```bash
rm -rf node_modules packages/*/node_modules apps/*/node_modules
pnpm install --frozen-lockfile
pnpm --filter @kvui/css icons:update     # optional: bundles the Material Symbols font (needs internet)
pnpm docs                                   # API reference, Vue wrappers, agent context
node apps/shared/scripts/snapshot.mjs       # component data for the playgrounds
pnpm build
```

### Step 3: run every check

Each must pass before you go on:

```bash
pnpm test                                   # unit tests, CSS checks, icon and release tests
pnpm check:names                            # no prop or method shadows a DOM member
pnpm docs:check                             # every component documented; links and props correct
pnpm playgrounds:check                      # playgrounds use real components and classes
pnpm --filter @kvui/css test:browser     # layout tests in Chromium (needs Playwright)
node scripts/verify-publishable.mjs         # all seven packages would ship
node scripts/verify-dist.mjs                # every package has its built entry points
```

If `verify-dist.mjs` reports a missing file, that package's build did not finish. Fix it and build again.

### Step 4: pack the tarballs

```bash
node scripts/release.mjs pack
ls dist-tarballs/
cat dist-tarballs/SHA256SUMS.txt
```

`pack` starts from an empty folder, so no leftover tarball from an earlier build can be published. Check the Angular tarball has `dist/` content and no `src/`:

```bash
tar -tzf dist-tarballs/nova-ui-angular-*.tgz | head -20
```

### Step 5: dry run

```bash
node scripts/release.mjs publish --dry-run
```

Each line should read `publish`, with the names and the new version. `skip` means that version is already on npm.

### Step 6: publish

```bash
node scripts/release.mjs publish
```

If npm asks for a one-time code, supply it with `--otp 123456`. Codes expire quickly, so use a fresh one. Re-running is safe: packages already on npm are skipped.

To publish a pre-release under a tag, see section 8.

### Step 7: tag and create the GitHub release

```bash
VERSION=$(node -p "require('./packages/core/package.json').version")
git tag -a "v$VERSION" -m "Nova UI $VERSION"
git push origin main
git push origin "v$VERSION"
gh release create "v$VERSION" dist-tarballs/* --title "Nova UI $VERSION" --generate-notes
```

Without `gh`, create the release on GitHub: choose the tag, paste the changelog notes, and attach the files from `dist-tarballs/`.

### Step 8: verify the release

Each package should print the new version:

```bash
for p in core css react angular vue editor tailwind; do
  echo -n "@kvui/$p: "; npm view "@kvui/$p@$VERSION" version
done
```

Install into a clean project and check it resolves:

```bash
mkdir /tmp/nova-smoke && cd /tmp/nova-smoke && npm init -y >/dev/null
npm install @kvui/core@$VERSION @kvui/css@$VERSION @kvui/react@$VERSION
node -e "console.log(require.resolve('@kvui/core/package.json'))"
```

## 6. Release through GitHub Actions

This is the normal route. It needs no local publishing.

1. Apply the versions (step 1 above), commit, and push to `main`. CI runs.
2. Push a tag: `git tag -a v0.2.0 -m "Nova UI 0.2.0" && git push origin v0.2.0`.
3. `.github/workflows/dist.yml` runs. It builds, runs every check, packs, verifies, and uploads the tarballs with `SHA256SUMS.txt`. Then the `publish` job publishes each package not yet on npm, with npm provenance. Then the `release` job creates the GitHub release with the bundles attached.
4. If the `npm` environment requires approval, approve it in the Actions tab.

To publish without a tag, start the `dist` workflow by hand and tick `publish`. The `include_icons` input controls the Material icon download.

Every push to `main` and every pull request also runs the bundle job, so a broken build shows up before a release is tagged. Packing errors and the Material download are the usual causes; the download is optional and does not fail the build.

Use one route per version. Both skip versions already on npm, so using both is safe, but the history is easier to follow with one.

## 7. Pre-releases

Release candidates use versions such as `0.3.0-rc.1` and are published under the `next` dist-tag. The default install keeps getting the latest stable release:

```bash
node scripts/release.mjs publish --tag next
```

Users opt in with `npm install @kvui/core@next`. Publish the stable version later without a tag to promote it.

## 8. Fixing mistakes

- **Wrong version published.** npm does not allow reuse of a version number, even after unpublishing. Publish a fix as the next patch, and deprecate the bad one:
  `npm deprecate "@kvui/core@0.2.0" "Broken build. Use 0.2.1."`
- **Something missing from a published package.** Fix the build, add a changeset, release the next patch. Do not try to replace the old version.
- **Unpublish.** Possible only within 72 hours, and only if nothing depends on the version. Otherwise deprecate.
- **Angular shipped source.** The Angular package was packed from its folder, not `dist/`. Never use `changeset publish` directly for this repository: it packs each folder as-is. Use `node scripts/release.mjs`. Deprecate the bad version and publish a fix.
- **403 Forbidden or OTP errors.** Check `npm whoami`, the scope membership, and supply `--otp`.
- **Provenance failed in CI.** Each package's `repository` field must match this repository.
- **Tag points at the wrong commit.** If it was never pushed, delete and re-tag. If it was pushed but npm has not received the version, delete the remote tag and re-tag. If npm has the version, never move the tag: publish a patch.

More detail for each case is in [release-manual.md](release-manual.md) section 13.

## 9. Release checklist

- [ ] `main` is up to date and the tree is clean; CI is green.
- [ ] Every change has a changeset, and the bump matches the change.
- [ ] `pnpm version-packages` ran; all seven packages show the same version; changelogs read well for users.
- [ ] Clean install from the lockfile; `pnpm docs`, the snapshot and `pnpm build` succeeded.
- [ ] `pnpm test`, `pnpm check:names`, `pnpm docs:check`, `pnpm playgrounds:check` pass.
- [ ] `node scripts/verify-publishable.mjs` and `node scripts/verify-dist.mjs` pass.
- [ ] `node scripts/release.mjs pack` produced seven tarballs and checksums; Angular ships `dist/`, not source.
- [ ] `node scripts/release.mjs publish --dry-run` lists the expected versions.
- [ ] Published (manually, or by the workflow); every package reports the new version on npm.
- [ ] Release commit and tag pushed; GitHub release created with tarballs and checksums.
- [ ] Clean install of `@kvui/core`, `css` and `react` works.
- [ ] Breaking changes have a migration note in the changelog.

## 10. What the release ships to users

Users install the packages with `npm install` and upgrade them together. The full guide is [docs/users/releases.md](../users/releases.md). The release notes must tell them the things below.

**Install** (the packages for the framework they use, all at the same version):

```bash
npm install @kvui/core @kvui/css @kvui/react     # React, Next.js, Vite with React
npm install @kvui/core @kvui/css @kvui/angular   # Angular
npm install @kvui/core @kvui/css @kvui/vue       # Vue 3
```

**Peer dependencies** the installer expects:

| Package | Peer | Range |
| --- | --- | --- |
| `@kvui/react` | `react`, `react-dom` | `>=18` |
| `@kvui/angular` | `@angular/core`, `@angular/common` | `>=17` |
| `@kvui/vue` | `vue` | `>=3.3.0` |
| `@kvui/tailwind` | `tailwindcss` | `>=3.3.0` |
| `@kvui/editor`, `@kvui/vue` | `@kvui/core` | `^0.1.0` |

**Verification users can do:** each version on npm shows its repository and, for releases built by the workflow, "Built and signed on GitHub Actions" with a link to the run. The GitHub release attaches `SHA256SUMS.txt`, checked with `sha256sum -c SHA256SUMS.txt`.

**Upgrading:** read the changelog for every version in between, upgrade all Nova packages together, and check the migration notes for breaking changes. Pre-release users install with `@next`.

## 11. Distribution bundles

`.github/workflows/dist.yml` builds the distribution bundles on every push to `main`, on pull requests and on manual trigger. It installs from the lockfile, optionally downloads the Material Symbols, generates docs and snapshots, builds every package, runs all checks, packs each public package (Angular from `dist/`), writes `SHA256SUMS.txt`, and uploads the bundles as an artifact kept for 30 days. A tag runs the publish and release jobs as described in section 6.

Packages publish their built output. The core package includes `dist-docs/`, so tools and agents can read the API reference from the installed package.
