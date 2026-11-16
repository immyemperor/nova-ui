# Contributing

## Set up

```bash
pnpm install
pnpm build           # builds every package in dependency order
pnpm verify          # unit tests, prop-name check
pnpm dev:vite        # run the React playground
```

Node 20 or later. Use pnpm 9 (the version pinned in `package.json`).

## Make a change

1. **Find the rule.** Put logic in `core/src/utils` if it's pure. Put DOM behaviour in the component.
2. **Write or update the test first** for any rule (see [Testing](testing.md)).
3. **Keep tokens and strings out of components.** Use `--nova-*` variables and `t('key')`. Add new strings to `DEFAULT_MESSAGES`.
4. **Use the existing patterns.** Look at a similar component. Props that objects go through are `@Prop()` with no attribute parsing; events are `@Event()` with `EventEmitter<T>`.
5. **Regenerate** any generated files you touched (table in [Architecture](architecture.md)).
6. **Update the docs** in `docs/users/features/` for any user-visible change, and run `pnpm docs:check`.
7. **Add a changeset**: `pnpm changeset`. Pick the packages and the bump.

## Adding a component

1. Create `packages/core/src/components/ui-<name>/ui-<name>.tsx` and `.css`.
2. Give it a `tag`, typed `@Prop`s with a `/** doc comment */` above each, `@Event`s, and `@Method`s.
3. Put any pure logic in `packages/core/src/utils/<name>.ts` with tests in `packages/core/test/`.
4. Add strings to `i18n/messages.ts`.
5. Run `pnpm docs` (regenerates the API reference, Vue wrappers and editor data) and `pnpm check:names`.
6. Add it to the right feature guide in `docs/users/features/` and to the table in `docs/users/features/README.md`.
7. Add it to `apps/playground-vite/src/` so it appears in the demo, then type-check the playground.

## Code style

- TypeScript strict where the tooling allows. Explicit types on public APIs.
- Prefer pure functions for logic that can be tested without a browser.
- No `any` in new public API. Internal `as any` only for documented Stencil or DOM gaps.
- Comments explain why, not what. Doc comments on every public prop, event and method (these become the API reference).
- No new runtime dependencies in core without discussion. Core stays framework-free.

## Pull request checklist

- [ ] Tests added or updated, and `pnpm test` passes.
- [ ] `pnpm check:names` passes if you added props or methods.
- [ ] Generated files regenerated and committed.
- [ ] Docs updated, and `pnpm docs:check` passes.
- [ ] Changeset added.
- [ ] Keyboard and screen-reader behaviour considered for any interactive change.
- [ ] Colour changes re-checked for contrast (the build does this).
