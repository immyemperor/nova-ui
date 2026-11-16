# Project status

An honest picture of what is built, what is tested, and what has only been written. Update this with every release.

## Built

| Area | Components or features | Verified by |
| --- | --- | --- |
| Foundation | Tokens, light, dark and system themes, theme toggle, icons (68), i18n catalogue (94 keys), motion helpers | Logic tests, CSS checks |
| Forms | Input, textarea, checkbox, switch, radio group, slider, rating, OTP, tags, field wrapper, date, date range, time, colour, calendar | Logic tests (date, range, time, colour); type-check |
| Overlays | Modal, drawer, popover, tooltip, dropdown, context menu, searchable select, command palette, toaster, confirm and prompt | Queue and focus logic tests; type-check |
| Navigation | Tabs, accordion, breadcrumb, pagination, stepper, nav menu, menubar, sidebar, split panes, collapse | Type-check; keyboard logic partly tested |
| Data | Table (sort, search, select, paginate, export, resize, expand, virtual), tree, virtual list, sortable, kanban, scheduler | Layout, export, window, reorder, calendar logic tests; type-check |
| Charts | Line, area, bar, donut, sparkline | Chart maths tests (13); type-check |
| Files | File upload with validation | Validation tests (7); type-check |
| Content | Safe HTML, rich text editor, page blocks | Sanitiser security tests (11 in a real DOM); editor helper tests; type-check |
| Layout and CSS | Layout primitives, utilities, container queries, CSS components, print, scroll-linked motion | Build checks, 46 contrast pairs, 2-build browser layout tests |
| Ecosystem | React, Angular, Vue wrappers, Tailwind preset, generated API docs, editor autocomplete data, CI workflow | Generated and parsed or type-checked; Tailwind tokens tested |
| Documentation | Human, user and agent docs for every feature and framework; `llms.txt`, `llms-full.txt`, `AGENTS.md` | `pnpm docs:check`: every component documented, every prop and event named in the guides exists, every link resolves |

## Not yet verified

- **A real `pnpm install && pnpm build`.** The sandbox used to write this code couldn't reach the package registry, so Stencil has never compiled these components. This is the single biggest open risk.
- **Component behaviour in browsers**, beyond the CSS layer.
- **Frameworks running the wrappers** (React, Angular, Vue) end to end.
- **Accessibility with screen readers and Windows High Contrast.**
- **Server rendering.** Components render on the client. Stencil's hydration output is not enabled.
- **Stencil spec tests and CI runs.** The CI workflow is written but has not executed.

## Documentation limits

- The guides describe intended behaviour from the source. Examples have been checked for prop and event names, not run in a browser.
- Framework guides for Angular and Vue describe setups that aren't built in CI yet.

## Known gaps

- Drag-and-drop announcements for screen readers.
- Editor suggestion popup is not announced as a linked combobox.
- Table virtual mode and expansion don't combine.
- Icons are hand-drawn, not imported from a licensed set; check each visually.
- Angular playground has not been built.

## Next

1. Run the real build and fix what it reports.
2. Enable Stencil hydration for server rendering.
3. Add Stencil spec tests for interaction behaviour.
4. Run the wrappers inside each framework in CI.
