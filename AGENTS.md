# AGENTS.md

Instructions for AI coding agents working with or inside the Nova UI repository.

## What this repository is

Nova UI is a design system: web components (Stencil) with generated wrappers for React, Angular and Vue, a CSS library, a Tailwind preset, and an optional rich text editor. Monorepo managed with pnpm.

## Read these first

1. `docs/agents/conventions.md`: which component to use, and the rules that prevent most mistakes.
2. `docs/users/features/README.md`: the feature guides.
3. `packages/core/dist-docs/API.md`: every component, prop, event, method and slot. Treat it as authoritative for names.
4. `docs/humans/architecture.md`: where code lives and what is generated.

A single-file version of the user and agent docs is at `docs/llms-full.txt`. The index is `llms.txt`.

## Using Nova in an application

- Import the stylesheet once: `@import '@nova-ui/css/nova.css';`.
- Use the wrapper for the framework: `@nova-ui/react`, `@nova-ui/angular`, `@nova-ui/vue`, or the plain `ui-*` tags.
- Pass arrays and objects as properties, never as attributes.
- Listen to `ui`-prefixed events and read `event.detail`.
- Give every control a `label` or accessible name.
- Use CSS variables (`--nova-*`) for colour and spacing.
- Sanitise any HTML you didn't write, with `ui-html` or `sanitizeHTML`.

## Working inside this repository

- **Run the checks** before reporting success: `pnpm build`, `pnpm test`, `pnpm check:names`, `pnpm docs:check`. If you can't run one, say so.
- **Don't edit generated files.** `packages/core/dist-docs/*`, `packages/vue/src/components.ts`, `packages/react/src/components/stencil-generated/*`, `packages/angular/src/lib/stencil-generated/*`, `packages/css/src/generated/utilities.css`, `docs/llms-full.txt`. Change the generator's source, then regenerate.
- **Put logic in `packages/core/src/utils`** when it's pure, and test it in `packages/core/test`. Components call the logic.
- **Add strings to `packages/core/src/i18n/messages.ts`** and call `t('key')`. Don't hard-code visible text in components.
- **Use `--nova-*` tokens**, not literal colours or sizes, in component CSS.
- **Props that the component sets itself must be `mutable`.** Stencil warns otherwise.
- **Prop names must not shadow DOM members.** `pnpm check:names` checks this.
- **Local variables named `t` shadow the translator** in files that call `t()`. Use another name.
- **Keep components framework-free.** Core must not import React, Angular or Vue.
- **Document what you add.** Update the feature guide and run `pnpm docs` to refresh the reference.

## Known limits (do not claim otherwise)

- Stencil has not compiled this code in the environment used to write it. Say so if you're asked whether it builds.
- Component interaction is mostly tested through logic, not in a browser. Say which layer your evidence covers.
- Server rendering is not enabled.
- The Vue and Angular wrappers have not been run inside their frameworks in CI.
- Icons are hand-drawn; they render but haven't been checked against a design source.

See `docs/humans/status.md` for the full picture.

## Reporting

When you finish a task, list: what changed, which checks you ran and their results, and which checks you could not run. Don't present unverified output as verified.
