# Release manual

Step-by-step instructions for releasing Nova UI. Use it for a first release, for an emergency, or when GitHub Actions is unavailable. Two ways are described: **by hand from your machine**, and **through GitHub Actions** (the normal route). Both publish the same tarballs.

Read the whole manual once before your first release.

## Contents

1. [What gets released](#1-what-gets-released)
2. [One-time setup](#2-one-time-setup)
3. [Before you start](#3-before-you-start)
4. [Step 1: decide the version](#4-step-1-decide-the-version)
5. [Step 2: build and check](#5-step-2-build-and-check)
6. [Step 3: pack the tarballs](#6-step-3-pack-the-tarballs)
7. [Step 4: dry run](#7-step-4-dry-run)
8. [Step 5: publish](#8-step-5-publish)
9. [Step 6: tag and GitHub release](#9-step-6-tag-and-github-release)
10. [Step 7: verify the release](#10-step-7-verify-the-release)
11. [Releasing through GitHub Actions](#11-releasing-through-github-actions)
12. [Pre-releases](#12-pre-releases)
13. [Mistakes and how to fix them](#13-mistakes-and-how-to-fix-them)
14. [Release checklist](#14-release-checklist)

---

## 1. What gets released

Seven packages, always together, always at the same version:

| Package | Contents | Built into |
| --- | --- | --- |
| `@omni/core` | Web components, tokens, theme, utilities, API reference (`dist-docs`) | `dist/`, `loader/` |
| `@omni/css` | Layout, utilities, CSS components, optional Material icons | `dist/` |
| `@omni/react` | React wrappers, hooks, page blocks, `/editor` and `/server` entries | `dist/` |
| `@omni/angular` | Angular standalone wrappers and services | `dist/` (ng-packagr; packed from there) |
| `@omni/vue` | Vue 3 wrappers | `dist/` |
| `@omni/editor` | Rich text editor (Tiptap) | `dist/`, `loader/` |
| `@omni/tailwind` | Tailwind preset | `index.js` |

Playgrounds under `apps/` are never released.

## 2. One-time setup

Do this once per machine, and once per repository.

**npm account and scope**

1. Log in at npmjs.com, and turn on two-factor authentication (2FA).
2. Make sure you can publish to the `@omni` scope. The first publish of a new scope needs the organisation to exist: create it at npmjs.com if it doesn't.
3. On your machine, log in:

   ```bash
   npm login
   npm whoami           # should print your npm username
   ```

**Tools**

```bash
node -v      # 20 or newer
pnpm -v      # 9.x (matches package.json)
git --version
```

**GitHub (for the release page and CI publishing only)**

- A repository secret named `NPM_TOKEN`: an npm automation token with publish rights for `@omni`.
- Optional: a GitHub environment named `npm` with required reviewers.

## 3. Before you start

- [ ] You are on `main`, and it is up to date: `git checkout main && git pull`.
- [ ] The working tree is clean: `git status` shows nothing to commit.
- [ ] The changes you want to release are merged.
- [ ] Each change has a changeset (`pnpm changeset`). `git status` will not show them, but `ls .changeset` lists them.

```bash
git checkout main
git pull
git status
ls .changeset/*.md
```

## 4. Step 1: decide the version

Versions follow semver:

- **patch** (0.2.0 to 0.2.1): fixes, no change to the public API.
- **minor** (0.2.0 to 0.3.0): new components, props, events, tokens. Existing code keeps working.
- **major** (0.2.0 to 1.0.0): removed or renamed props, events, tokens or classes.

Apply the changesets. This bumps all seven packages to the same version, and writes the changelogs:

```bash
pnpm version-packages
```

Read the result before going on:

```bash
git diff --stat
grep '"version"' packages/*/package.json
cat packages/core/CHANGELOG.md | head -40
```

Every package should show the same new version. If one does not, stop and check the changeset files.

Commit the version bump:

```bash
git add -A
git commit -m "chore: release $(node -p "require('./packages/core/package.json').version")"
```

## 5. Step 2: build and check

Install from the lockfile, then build. Use a clean install so nothing stale is shipped:

```bash
rm -rf node_modules packages/*/node_modules apps/*/node_modules
pnpm install --frozen-lockfile
```

Optional: download the Material Symbols before building, so `@omni/css` includes the icon font. This needs internet access:

```bash
pnpm --filter @omni/css icons:update
```

Generate the derived files (API reference, Vue wrappers, agent context, playground data), then build every package:

```bash
pnpm docs
node apps/shared/scripts/snapshot.mjs
pnpm build
```

Run the checks. Each must pass:

```bash
pnpm test                   # unit tests, CSS checks, Material icon tests, release tests
pnpm check:names            # no prop or method shadows a DOM member
pnpm docs:check             # every component documented, links and props correct
pnpm playgrounds:check      # playgrounds use real components and classes
pnpm --filter @omni/css test:browser   # layout tests in Chromium (needs Playwright)
node scripts/verify-publishable.mjs       # all seven packages would ship
node scripts/verify-dist.mjs              # every package has its built entry points
```

If `verify-dist.mjs` reports a missing file, the build for that package did not finish. Look at the build output for that package, fix it, and build again. Do not continue past a failure.

## 6. Step 3: pack the tarballs

A tarball is exactly what npm will receive, so inspect it before publishing:

```bash
node scripts/release.mjs pack
ls -la dist-tarballs/
cat dist-tarballs/SHA256SUMS.txt
```

You should see seven `.tgz` files, one per package, plus `SHA256SUMS.txt`.

Check what is inside one of them. Pick the Angular package, since it is packed from its build folder:

```bash
tar -tzf dist-tarballs/nova-ui-angular-*.tgz | head -20
```

Expected: paths starting with `package/`, such as `package/package.json`, `package/fesm2022/...`, `package/index.d.ts`. Not expected: `package/src/...` or `package/node_modules/...`. If you see source files, stop: the wrong folder was packed.

`pack` starts from an empty `dist-tarballs/` folder, so an old tarball from an earlier build is never published. The next step prints every package name and version.

## 7. Step 4: dry run

A dry run contacts npm and shows what would be published, but publishes nothing:

```bash
node scripts/release.mjs publish --dry-run
```

Each line is either `skip` (that version is already on npm) or `publish`. For a first release every line should say `publish`. Check the names and versions match what you expect.

If you have a 2FA authenticator, the dry run does not need a code.

## 8. Step 5: publish

Publish the tarballs:

```bash
node scripts/release.mjs publish
```

npm will ask for a one-time code from your authenticator if 2FA requires it on publish. Two ways to supply it:

- Let npm prompt you, one package at a time, or
- Pass it once for everything: `node scripts/release.mjs publish --otp 123456`. Codes expire after about 30 seconds, so use a fresh code, and re-run if it times out. Re-running is safe: packages already published are skipped.

**If a publish fails partway through**, nothing needs undoing. Packages that succeeded are skipped on the next run. Fix the cause (usually authentication or a network error), and run `publish` again.

### Publishing from a machine that is not yours

Do not publish from a shared or borrowed machine. If you must, log in with a token from a short-lived npm automation token, never your password, and revoke the token afterwards.

## 9. Step 6: tag and GitHub release

Tag the release commit, so the source for version 0.2.0 can always be found:

```bash
VERSION=$(node -p "require('./packages/core/package.json').version")
git tag -a "v$VERSION" -m "Nova UI $VERSION"
git push origin main
git push origin "v$VERSION"
```

Create the GitHub release and attach the tarballs and checksums:

```bash
gh release create "v$VERSION" dist-tarballs/* \
  --title "Nova UI $VERSION" \
  --generate-notes
```

No `gh`? Create the release at github.com: Releases, Draft a new release, choose the tag, paste the notes from `packages/core/CHANGELOG.md`, attach the files from `dist-tarballs/`.

## 10. Step 7: verify the release

Check that npm serves the new version, for every package. Each should print the version you just published:

```bash
VERSION=$(node -p "require('./packages/core/package.json').version")
for p in core css react angular vue editor tailwind; do
  echo -n "@omni/$p: "
  npm view "@omni/$p@$VERSION" version
done
```

Install into a clean project, and check the package works. This catches a missing file that the checks cannot:

```bash
mkdir /tmp/nova-smoke && cd /tmp/nova-smoke
npm init -y >/dev/null
npm install @omni/core@$VERSION @omni/css@$VERSION @omni/react@$VERSION
node -e "console.log(require.resolve('@omni/core/package.json'))"
cd - >/dev/null
```

Check the provenance badge: on npmjs.com, open `@omni/core`. A tag-based release from CI shows "Built and signed on GitHub Actions". A manual release does not, which is expected.

Check the documentation site or README links still point to the new version.

## 11. Releasing through GitHub Actions

This is the normal route, and needs no local publishing.

1. Complete steps 1 (`pnpm version-packages`) and commit, as above.
2. Push the commit to `main`. The CI workflow runs.
3. Push a tag: `git tag -a v0.2.0 -m "Nova UI 0.2.0" && git push origin v0.2.0`.
4. The `dist` workflow runs: it builds, tests, packs, publishes with provenance, and creates the GitHub release with the bundles attached.
5. Watch the run in the Actions tab. If the `npm` environment requires a reviewer, approve it there.

To publish from GitHub without a tag, start the `dist` workflow by hand, and tick `publish`.

Use the manual route (steps 2 to 10) when Actions is down, or for a first release before the secret exists. Do not use both for the same version: the second run skips versions already on npm, which is safe, but it makes the history harder to follow.

## 12. Pre-releases

For a release candidate, use a version such as `0.3.0-rc.1`, and publish under a dist-tag so that `npm install @omni/core` keeps getting the latest stable version:

```bash
node scripts/release.mjs publish --tag next
```

Users then opt in with `npm install @omni/core@next`. Promote a release candidate to stable by publishing the stable version normally, without a tag.

## 13. Mistakes and how to fix them

**I published the wrong version.** npm does not let you reuse a version number, even after unpublishing. Publish the fix as the next patch (`0.2.1`). If the bad version is harmful, deprecate it:

```bash
npm deprecate "@omni/core@0.2.0" "Broken build. Use 0.2.1."
```

**I published, and something is missing from the package.** Fix the build, bump to the next patch with a changeset, and publish again. Do not try to replace the old version.

**Unpublish.** npm allows `npm unpublish` only within 72 hours of publishing, and only if no other package depends on it. After that, deprecate instead. Unpublishing is almost never the right answer, because other people's builds may depend on the version.

**Angular shipped source files.** This happens if the Angular package was packed from its folder, not from `dist/`. Do not use `changeset publish` for this repository: it packs each package folder directly. Use `node scripts/release.mjs` (or `pnpm release`), which packs from `dist/` for Angular. If source was published, deprecate that version, publish a fix, and tell users.

**`npm publish` says 403 Forbidden.** Your account lacks rights to the `@omni` scope, or 2FA needs a code. Check `npm whoami`, check the scope membership at npmjs.com, and retry with `--otp`.

**`npm publish` says the version already exists.** Another publish already succeeded. Run `node scripts/release.mjs publish` again: it skips versions already on npm.

**Provenance failed in CI.** The package's `repository` field must match the repository the workflow runs in. Check each `packages/*/package.json`.

**A package is missing from the release.** Run `node scripts/verify-publishable.mjs`. It lists every package and every problem. Most often a package has `"private": true` or is missing from the changeset fixed group.

**The tag points at the wrong commit.** If the tag was not pushed, delete it and re-tag: `git tag -d v0.2.0`. If it was pushed and npm has not received the version, delete the remote tag with `git push origin :refs/tags/v0.2.0` and re-tag. If npm has the version, do not move the tag: publish a patch instead.

## 14. Release checklist

Copy this into the release issue or pull request, and tick each line.

- [ ] `main` is up to date and the tree is clean.
- [ ] Every change has a changeset. The version bump is correct for the changes.
- [ ] `pnpm version-packages` ran, all seven packages show the same version, changelogs read well.
- [ ] Clean install from the lockfile, then `pnpm docs`, the snapshot, and `pnpm build`.
- [ ] `pnpm test`, `pnpm check:names`, `pnpm docs:check`, `pnpm playgrounds:check` all pass.
- [ ] `node scripts/verify-publishable.mjs` and `node scripts/verify-dist.mjs` pass.
- [ ] `node scripts/release.mjs pack` produced seven tarballs and checksums.
- [ ] A tarball's contents were inspected: Angular ships `dist/`, not source.
- [ ] `node scripts/release.mjs publish --dry-run` lists the expected versions.
- [ ] Logged in to npm as the release owner, with 2FA ready.
- [ ] `node scripts/release.mjs publish` completed, and every package reports the new version on npm.
- [ ] Release commit pushed, tag `vX.Y.Z` pushed.
- [ ] GitHub release created with tarballs and checksums attached.
- [ ] A clean install of `@omni/core`, `css` and `react` works.
- [ ] Release announced, and any deprecations of earlier broken versions are in place.
