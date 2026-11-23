# Conventions for AI agents

Read this before generating code that uses Nova UI. It states the rules that matter and the choices that agents most often get wrong. Also read [AGENTS.md](../../AGENTS.md) at the repository root.

## Choose the component

| If you need… | Use | Not |
| --- | --- | --- |
| Single-line text | `ui-input` | a bare `<input>` |
| Multi-line text | `ui-textarea` | a bare `<textarea>` |
| Pick one from a list | `ui-select` (searchable) or `ui-radio-group` (few options) | a native `<select>` for long lists |
| Yes or no | `ui-switch` (immediate effect) or `ui-checkbox` (part of a form) | a button |
| A date | `ui-date-picker` | `<input type="date">` when you need Nova styling or range |
| A date range | `ui-date-range-picker` | two date inputs |
| A time | `ui-time-picker` | `<input type="time">` when you need Nova styling |
| A confirmation | `await confirm({...})` | `window.confirm` |
| A short input prompt | `await prompt({...})` | `window.prompt` |
| A notification | `toast.success/error/info/warning` | `alert()` |
| A popup form or detail | `ui-modal` | a custom div |
| Actions on an item | `ui-dropdown` with `ui-menu-item` | a custom menu |
| Tabs | `ui-tabs` with `ui-tab` and `ui-tab-panel` | buttons toggling divs |
| Collapsible content | `ui-accordion` or `ui-collapse` | `<details>` when you need Nova styling or animation |
| A data grid | `ui-table` | a hand-built table with sorting |
| Thousands of rows | `ui-table` with `virtual`, or `ui-virtual-list` | a plain long list |
| A chart | `ui-chart` | an image or a hand-drawn SVG without a data table |
| A small trend | `ui-sparkline` | a chart with axes |
| Reorderable list | `ui-sortable` | custom drag code |
| Board of cards | `ui-kanban` | custom drag code |
| Calendar events | `ui-scheduler` | a custom grid |
| Upload files | `ui-file-upload` | a bare `<input type="file">` for multiple files with validation |
| Rich text | `ui-editor` (import from the editor package) | contenteditable |
| Display HTML from elsewhere | `ui-html` | `innerHTML` |
| Layout | `nova-container`, `nova-stack`, `nova-cluster`, `nova-grid-auto` | custom flex or grid for common patterns |
| A brand palette | `generateTheme` | hand-picked colours that may fail contrast |

## Rules

1. **Import once.** `@import '@kvui/css/nova.css'` once per app. Import framework wrappers from the framework package.
2. **Arrays and objects are properties.** Set `options`, `columns`, `rows`, `series`, `labels`, `nodes`, `commands`, `items`, `cards`, `layout`, `events`, `tiers`, `swatches`, `validate`, `uploadFn`, `renderRow`, `toolbar`, `mentionProvider`, `uploadHandler` as JavaScript values. Never as HTML attributes.
3. **Use the event `detail`.** The new value is in `event.detail`. In React: `onUiChange={(e) => set(e.detail)}`. In Angular: `(uiChange)="set($event.detail)"`. In Vue: `@ui-change="(e) => set(e.detail)"`.
4. **Every control has a name.** `label` on inputs and selects, `label` on icon-only buttons, `label` on charts and tables with a `caption`.
5. **Forms use `name`.** Controls submit with their `name` inside `<form>`. Don't wire up hidden inputs yourself.
6. **Don't mutate props.** Keep state in your framework and update it from events.
7. **Use tokens, not hex.** `var(--nova-color-accent)`, not `#0b7a6c`. Tailwind: `bg-nova-accent`.
8. **Sanitise HTML.** Use `<ui-html>` or `sanitizeHTML()`. Never `innerHTML` with untrusted input.
9. **Respect motion.** Don't add animations that the user can't turn off. Components already do this.
10. **Don't edit generated files.** See the table in [Architecture](../humans/architecture.md).
11. **Don't invent props.** Check the [component reference](../../packages/core/dist-docs/API.md) or `custom-elements.json`. If a prop isn't listed, it doesn't exist.

## Framework imports

| Framework | Components | Editor | Helpers |
| --- | --- | --- | --- |
| React | `import { UiButton } from '@kvui/react'` | `import { UiEditor } from '@kvui/react/editor'` | `import { toast, confirm } from '@kvui/react'` |
| Next.js | as React, in a `'use client'` file | as React, with `dynamic(..., { ssr: false })` | as React |
| Angular | `import { UiButton } from '@kvui/angular'` (standalone) | `import { UiEditor } from '@kvui/angular/editor'` | `import { ThemeService, toast } from '@kvui/angular'` |
| Vue 3 | `import { UiButton } from '@kvui/vue'` | not yet provided | not yet provided |
| Plain HTML | `<ui-button>` after `defineCustomElements()` | `import '@kvui/editor'` | `import { toast } from '@kvui/core'` |

## Common mistakes

- `<ui-select options='[...]'>`: wrong. Set `select.options = [...]`.
- `onChange` on a Nova component in React: use `onUiChange`.
- `(change)` in Angular: use `(uiChange)`.
- `ui-datepicker`: the tag is `ui-date-picker`.
- `ui-icon name="warning-circle"`: not in the registry. Use `alert-circle`, `alert-triangle` or `info`. Run `listIcons()` for the list.
- Calling `getHTML()` on the editor: the method is `getContentHTML()`.
- Using `prefix` or `suffix` on `ui-counter`: they're `prefix-text` and `suffix-text`.
- Assuming `ui-table` sorts server data: set `manual` and handle `ui-query-change`.
- Claiming a feature is tested in a browser: only the CSS layer and the logic have browser or unit tests. See [status](../humans/status.md).

## When unsure

Read the component's entry in the reference, then the matching feature guide in `docs/users/features/`. If the docs and the code disagree, the code is right; report the docs bug.
