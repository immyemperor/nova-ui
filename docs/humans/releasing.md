# Releasing

Releases use [Changesets](https://github.com/changesets/changesets). The core, React, Angular, CSS, editor and related packages are in one fixed group, so they share a version.

## Normal release

```bash
pnpm changeset             # describe the change, choose packages and a bump
git add .changeset && git commit -m "chore: changeset"
pnpm version-packages      # applies versions and writes changelogs
pnpm build && pnpm verify  # everything must pass first
pnpm release               # publishes to npm
```

## Before you publish

- [ ] CI is green on `main`.
- [ ] `pnpm docs` run, so generated docs match the code.
- [ ] Changelog reads well for users. Breaking changes say what to do instead.
- [ ] Breaking changes to props, events or tokens have a migration note in `docs/`.
- [ ] Browser tests pass in both CSS builds.

## Version policy

- **Patch**: bug fixes and internal changes that don't change any public API.
- **Minor**: new components, props, events or tokens. Existing code keeps working.
- **Major**: removed or renamed props, events, tokens or classes; changed defaults that alter output.

Renaming a prop is a major change. The `prefix`/`suffix` and `getHTML` renames in this project were pre-release fixes; after 1.0 they would need a deprecation period.

## Dist folders

Packages publish their `dist/`. Don't publish source maps of private files or the `dist-docs` folder unless users need it. `dist-docs` is included with core so tools and agents can read the API.
