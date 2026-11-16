# Testing

Testing has four layers. Know which one covers what before you claim something is verified.

| Layer | Command | What it proves | Runs in CI |
| --- | --- | --- | --- |
| Logic unit tests | `pnpm --filter @nova-ui/core test` | Pure rules: dates, colour, search, layout maths, sanitiser, CSV, files, charts, presence, theme generation | Yes |
| Sanitiser security tests | (part of core tests) | XSS vectors against the real DOM (Playwright) | Yes, when Playwright is installed |
| CSS checks | `pnpm --filter @nova-ui/css test` | Built CSS is well formed, minifier safe, compat build has no layers, 46 contrast pairs pass, docs classes exist | Yes |
| Browser layout tests | `pnpm --filter @nova-ui/css test:browser` | Real Chromium: no overflow at 9 widths, shell reflow, grids, container queries, focus rings, both builds | Yes |
| Name check | `pnpm check:names` | No `@Prop` or `@Method` shadows a DOM member | Yes |
| Docs and wrapper checks | `pnpm docs:check`, `pnpm --filter @nova-ui/vue test`, `pnpm --filter @nova-ui/tailwind test` | Docs cover every component; links resolve; Vue output parses; Tailwind tokens exist | Yes |

## What is not tested yet

Be explicit about this when you report status:

- **Component behaviour in a browser.** Most components have logic tests, not interaction tests. Stencil spec and end-to-end tests need the real build first.
- **Framework output.** The React, Angular and Vue wrappers are generated and type-checked, but not run inside those frameworks in CI.
- **Accessibility with assistive tech.** Verified by design, not yet with a screen reader or on Windows High Contrast.
- **Playground rendering.** Type-checked; not screenshot-tested.

## Writing a logic test

```js
// packages/core/test/example.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadModule } from './load.mjs';

const M = loadModule('utils/example.ts');

test('does the thing', () => {
  assert.equal(M.doThing(2), 4);
});
```

`loadModule` transpiles the TypeScript source and its relative imports, so tests run the real code.

## Proving a test can fail

For any rule that protects users (security, contrast, data integrity), break the code on purpose and confirm the test fails, then restore it. Several tests in this repo were written this way and caught real bugs.

## Running everything

```bash
pnpm build && pnpm test && pnpm check:names && pnpm docs:check
```

## Adding browser tests

Use Playwright with the Chromium that ships in the environment. Put the test next to the others, and keep it deterministic: fixed viewports, no network, and `prefers-reduced-motion` set explicitly when motion matters.
