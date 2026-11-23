# Release guide: installing and upgrading Nova UI

For developers using Nova UI in their own apps. It covers what you install, how versions work, how to upgrade safely, and how to check a release.

Maintainers who publish releases should read [docs/humans/release-manual.md](../humans/release-manual.md) instead.

## Contents

1. [What you install](#1-what-you-install)
2. [Versions](#2-versions)
3. [Installing](#3-installing)
4. [Peer dependencies](#4-peer-dependencies)
5. [Upgrading](#5-upgrading)
6. [Reading a changelog](#6-reading-a-changelog)
7. [Pre-releases](#7-pre-releases)
8. [Pinning and rolling back](#8-pinning-and-rolling-back)
9. [Checking a release](#9-checking-a-release)
10. [Browser and runtime support](#10-browser-and-runtime-support)
11. [Deprecations](#11-deprecations)
12. [Troubleshooting](#12-troubleshooting)

## 1. What you install

Nova UI is published as seven npm packages. You install only the ones you use.

| Package | Install it when | Needs |
| --- | --- | --- |
| `@kvui/core` | Always: the web components, tokens, theme and utilities | Nothing |
| `@kvui/css` | You want layout classes, utilities or CSS-only components | Nothing |
| `@kvui/react` | Your app uses React, Next.js or Vite with React | `react`, `react-dom` |
| `@kvui/angular` | Your app uses Angular | `@angular/core`, `@angular/common` |
| `@kvui/vue` | Your app uses Vue 3 | `vue` |
| `@kvui/editor` | You want the rich text editor | Nothing extra (it uses `@kvui/core`) |
| `@kvui/tailwind` | You use Tailwind CSS and want Nova colours and radii as classes | `tailwindcss` |

A typical React app installs `core`, `css` and `react`. An Angular app installs `core`, `css` and `angular`.

## 2. Versions

All seven packages are released together, at the same version, so `@kvui/react@0.3.0` works with `@kvui/core@0.3.0`. Keep them on the same version.

Nova is pre-1.0. The version number means:

- **Patch** (`0.3.1`): bug fixes. Safe to take without reading anything else.
- **Minor** (`0.3.0`): new components, props, events or tokens. Existing code keeps working, but read the changelog.
- **Major** (`1.0.0`, later): removals or renames. Each one comes with a migration note.

Before 1.0, a minor release may still change a prop or event. The changelog says so when it happens.

## 3. Installing

Install the packages for your framework, at the same version:

```bash
# React, Next.js or Vite with React
npm install @kvui/core @kvui/css @kvui/react

# Angular
npm install @kvui/core @kvui/css @kvui/angular

# Vue 3
npm install @kvui/core @kvui/css @kvui/vue

# Add the rich text editor (optional)
npm install @kvui/editor

# Add Tailwind preset (optional)
npm install -D @kvui/tailwind
```

pnpm and yarn work the same way: use `pnpm add` or `yarn add` with the same package names.

Then import the stylesheet once, in your entry file:

```js
import '@kvui/css/nova.css';
```

See [Getting started](getting-started.md) for the first component.

## 4. Peer dependencies

Some packages expect you to install a framework yourself. npm 7 and later installs peer dependencies automatically, and shows a warning if the versions don't match.

| Package | Peer | Version range |
| --- | --- | --- |
| `@kvui/react` | `react`, `react-dom` | `>=18` |
| `@kvui/angular` | `@angular/core`, `@angular/common` | `>=17` |
| `@kvui/vue` | `vue` | `>=3.3.0` |
| `@kvui/tailwind` | `tailwindcss` | `>=3.3.0` |
| `@kvui/react`, `@kvui/angular` | `@kvui/editor` | optional: only if you use the editor entry point |
| `@kvui/editor`, `@kvui/vue` | `@kvui/core` | `^0.1.0` (the same minor as your other Nova packages) |

If npm reports a peer conflict, install the framework version in the range above, or upgrade the Nova packages together.

## 5. Upgrading

Upgrade every Nova package together:

```bash
npm install @kvui/core@latest @kvui/css@latest @kvui/react@latest
```

Then, in this order:

1. **Read the changelog** for every version between yours and the new one (section 6).
2. **Upgrade in a branch**, and run your tests and a visual check of the screens you use.
3. **Look for deprecation warnings** in the browser console (section 11).
4. **Check the migration notes** for any breaking change you hit.
5. **Ship** once your screens look right.

To see what would change before installing:

```bash
npm outdated @kvui/core @kvui/css @kvui/react
```

To see every version that exists:

```bash
npm view @kvui/core versions --json
```

## 6. Reading a changelog

Each package has a `CHANGELOG.md`, on npm (`npm view @kvui/core` shows the repository link) and in the GitHub release for each version. Every entry is one of:

- **Major changes**: removed or renamed APIs. Read these first.
- **Minor changes**: new features.
- **Patch changes**: fixes.

A changeset-style entry looks like this:

> **Breaking:** `ui-table` no longer sorts server data by default. Set `manual` and handle `ui-query-change`.

Each breaking change lists what to do instead. If an entry doesn't say, open an issue and ask.

The [component reference](../../packages/core/dist-docs/API.md) describes the current API, so after an upgrade, check the parts of it you use.

## 7. Pre-releases

Release candidates are published under the `next` tag, so the default install keeps getting the latest stable version:

```bash
npm install @kvui/core@next @kvui/css@next @kvui/react@next
```

Pre-releases can change between releases. Use them to test an upcoming version, not in production.

To go back to stable:

```bash
npm install @kvui/core@latest @kvui/css@latest @kvui/react@latest
```

## 8. Pinning and rolling back

To stop upgrades from happening automatically, pin the exact version in `package.json`:

```json
"dependencies": {
  "@kvui/core": "0.3.0",
  "@kvui/react": "0.3.0"
}
```

Without the `^`, npm will not move to a newer version when you run `npm install`.

To roll back after a bad upgrade, install the previous version of every Nova package:

```bash
npm install @kvui/core@0.2.0 @kvui/css@0.2.0 @kvui/react@0.2.0
```

Then check the lockfile (`package-lock.json`) is committed, so the rolled-back versions are what everyone on the team gets.

## 9. Checking a release

Every release is built and checked before it is published, but you can verify your copy:

**Version and source.** The package page on npm shows the version, the repository and, for releases built by GitHub Actions, "Built and signed on GitHub Actions" with a link to the workflow run. That run is the exact build you installed.

**Checksums.** Each GitHub release attaches the packed tarballs and a `SHA256SUMS.txt`. To check a download:

```bash
sha256sum -c SHA256SUMS.txt
```

It prints `OK` for each file that matches.

**Installed files.** The package contains only the built output, not source:

```bash
npm pack @kvui/angular@0.3.0 --dry-run
```

You should see `dist/` files and `package.json`, not `src/`.

## 10. Browser and runtime support

Nova targets current evergreen browsers (the latest versions of Chrome, Edge, Firefox and Safari, and the mobile browsers of the same period). Older browsers may work, but are not tested.

Some features depend on newer browser support, and degrade where it is missing:

| Feature | Needs | Without it |
| --- | --- | --- |
| Cascade layers (`@layer`) | Browsers from 2022 | Use `nova.compat.css`, which has no layers |
| Container queries (`nova-cq-*`) | Browsers from 2023 | Design the narrow layout as the default |
| View Transitions | Chrome, Edge, Safari 18+ | Updates happen without the transition |
| Scroll-linked motion (`nova-scroll-reveal`) | Browsers that support scroll timelines (`animation-timeline`) | Content shows without the animation |
| Popover (menus, tooltips) | Current browsers | Floating panels fall back to positioned elements |

Reduced-motion and high-contrast preferences are respected.

## 11. Deprecations

Before 1.0, a removal or rename can happen in a minor release, and the changelog says so under Major changes, with the replacement. Nova does not yet print deprecation warnings in the browser console, so check the changelog after each upgrade.

Once Nova reaches 1.0, APIs will be deprecated in one release and removed no earlier than the next major release, with a warning in the console in between.

## 12. Troubleshooting

**`npm ERR! peer dep conflict`.** A peer dependency is outside the range in section 4. Install the framework version the message asks for, or upgrade the Nova packages together.

**Components render as unstyled or not at all.** The stylesheet is missing. Import `@kvui/css/nova.css` once in your entry file (section 3).

**`@kvui/core` versions don't match.** Two Nova packages are on different versions. Install all of them at the same version, then delete `node_modules` and the lockfile only if the install still fails.

**Icons show as empty squares.** You switched to the Material icon set without loading its font. Load the font, or use the Nova set. See [Icons](features/icons.md).

**After upgrading, a prop or event stopped working.** Check the changelog for that version under Major or Minor changes. The migration note tells you the new name.

**Still stuck.** Open an issue at the repository with the package versions (`npm ls @kvui/core @kvui/css @kvui/react`), your framework version and a minimal reproduction.
