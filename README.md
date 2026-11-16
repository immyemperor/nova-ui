# Nova UI

One component library for **React, Next.js, Vite and Angular**. Components are built once as web
components with [Stencil](https://stenciljs.com); typed React and Angular wrappers are generated from them.

```
packages/
  core/      @nova-ui/core     web components, design tokens, theme manager, icons, motion
  editor/    @nova-ui/editor   optional rich text editor (Tiptap), kept out of core on purpose
  css/       @nova-ui/css      responsive CSS library: layout, grids, containers, utilities, guidelines
  react/     @nova-ui/react    generated React wrappers + useTheme()  (Next.js ready)
  angular/   @nova-ui/angular  generated standalone proxies + ThemeService
apps/
  playground-vite/             Vite + React demo
  playground-next/             Next.js App Router demo
```

## Documentation

- **Using Nova** (developers): [docs/users/getting-started.md](docs/users/getting-started.md), then your framework under [docs/users/frameworks](docs/users/frameworks/README.md) and the [feature guides](docs/users/features/README.md).
- **Contributing** (maintainers): [docs/humans](docs/humans/architecture.md), including architecture, testing and [project status](docs/humans/status.md).
- **AI agents**: [AGENTS.md](AGENTS.md), [llms.txt](llms.txt), and [docs/llms-full.txt](docs/llms-full.txt).
- **Reference**: [API.md](packages/core/dist-docs/API.md) lists every component, prop, event, method and slot.

Run `pnpm docs:check` to confirm the documentation covers every component and every link resolves.

## Status: Phases 1 to 5

| Area | Included |
| --- | --- |
| Foundation | tokens, light/dark/system theme manager, no-flash script, icon registry |
| Motion | `animateIn`, `staggerIn`, `<ui-reveal>`, `<ui-stagger>` (all honour reduced motion) |
| Components (1) | `ui-button`, `ui-icon`, `ui-theme-toggle` |
| Form controls (2) | `ui-input`, `ui-textarea`, `ui-checkbox`, `ui-radio-group` + `ui-radio`, `ui-switch`, `ui-slider`, `ui-rating` |
| Display (2) | `ui-card`, `ui-badge`, `ui-avatar`, `ui-alert`, `ui-skeleton`, `ui-spinner`, `ui-progress`, `ui-counter` |

Form controls are form-associated: they submit with a native `<form>`, honour `reset`, and report
`required` validity. Angular forms (`ngModel`, `formControl`) work through generated value accessors.
Events are `uiInput` / `uiChange`, which become `onUiInput` / `onUiChange` in React and
`(uiInput)` / `(uiChange)` in Angular.

### Overlays (Phase 3a)

| Component | Notes |
| --- | --- |
| `ui-modal`, `ui-drawer` | Native `<dialog>`: focus trap, inert background, Esc, scroll lock, focus returns to opener |
| `ui-popover` | Positioning primitive (flip + viewport shift), top layer, outside-click and Esc |
| `ui-tooltip` | Hover and keyboard focus, delay, Esc to dismiss |
| `ui-dropdown` + `ui-menu-item` | Arrow keys, Home/End, type-ahead |
| `ui-context-menu` | Right-click menu at the pointer |
| `ui-select` | Searchable combobox; single or multiple (chips); server-side search via `filter={false}` + `uiSearch` |
| `ui-command-palette` | `mod+k` launcher with fuzzy search and groups |
| `ui-toaster` + `toast()` | Render `<ui-toaster>` once; call `toast.success('Saved')` from anywhere |

Floating panels use the browser's Popover API, so they are never clipped by `overflow: hidden` parents.
### Navigation (Phase 3b)

| Component | Notes |
| --- | --- |
| `ui-tabs` + `ui-tab` + `ui-tab-panel` | Underline or pill style, horizontal or vertical, auto or manual activation, sliding indicator |
| `ui-accordion` + `ui-accordion-item` | Single or multiple open, animated height, arrow-key navigation between headers |
| `ui-breadcrumb` + `ui-breadcrumb-item` | Last item is the current page; `maxItems` folds long trails into an expandable "..." |
| `ui-pagination` | Pass `pageCount`, or `total` and `pageSize`; ellipses are generated for you |
| `ui-stepper` + `ui-step` | Horizontal or vertical, error state, optional click-back to completed steps |
| `ui-nav-menu` + `ui-nav-item` | Site navigation: links and disclosure panels (click to open, one at a time) |
| `ui-menubar` + `ui-menubar-menu` | Desktop-style File / Edit / View bar with hover-switching and Left/Right between menus |

Parent components manage their children (selection, ordering, tab stops), so children only need `value`,
`heading`, `href` and similar content props.

### Data and complex inputs (Phase 4)

| Component | Notes |
| --- | --- |
| `ui-table` | Sorting, search, row selection, built-in pagination, loading skeletons, sticky header, custom cells via slots |
| `ui-tree` | ARIA tree: expand/collapse, single selection, full keyboard support |
| `ui-carousel` | Scroll-snap; swipe, arrows, dots, multiple slides per view, autoplay with a pause button |
| `ui-marquee` | Seamless endless ticker; stops for reduced-motion users |
| `ui-otp-input` | Auto-advance, paste, SMS autofill, mask option; form-associated |
| `ui-tag-input` | Enter/comma/paste to add, `validate` hook, duplicate and max limits; form-associated |
| `ui-calendar`, `ui-date-picker` | `YYYY-MM-DD` values, min/max, grid keyboard model, month and year selects, type a date or pick one |
| `ui-color-picker` | Area + hue + hex + swatches + eyedropper where supported; popup or `inline` |

**Table data model**

```ts
const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'salary', label: 'Salary', sortable: true, align: 'end', format: (v) => `$${v}` },
];
```
- Browser mode: pass every row; sorting, search and paging happen in the component.
- Server mode: set `manual`, pass the current page as `rows` and the full count as `total`, and fetch in
  response to `uiQueryChange`, which carries `{ page, pageSize, sort, search }` (search is debounced).
- Custom cell markup: add a child with `slot="cell:<rowKey>:<columnKey>"`. Selection survives page changes
  and is reported through `uiSelectionChange`.

### Rich text editor (Phase 5): `@nova-ui/editor`

A separate, optional package, so apps that don't need it never download Tiptap.

```tsx
import { UiEditor } from '@nova-ui/react/editor';      // Angular: '@nova-ui/angular/editor'

<UiEditor
  label="Description"
  preset="full"                       // "minimal" | "standard" | "full"
  value={html}
  onUiChange={(e) => setHtml(e.detail)}
  uploadHandler={async (file) => (await myStorage.upload(file)).url}
  mentionProvider={(q) => searchUsers(q)}
/>
```
Plain HTML works too: `import '@nova-ui/editor'` then `<ui-editor preset="standard"></ui-editor>`.

| Option | What it does |
| --- | --- |
| `preset` / `toolbar` | Pick a preset, or list your own items in order: `['bold','italic','\|','link','image']` (`'\|'` is a separator). Items: `undo redo heading bold italic underline strike code textColor highlight alignLeft alignCenter alignRight bulletList orderedList taskList blockquote codeBlock hr link image attachment table` |
| `slashCommands` | "/" quick-insert menu. It only offers blocks your toolbar allows |
| `mentionProvider` | Turns on "@" mentions; return `{ id, label, description? }[]` (sync or async) |
| `uploadHandler` | `(file) => Promise<url \| { url, alt }>`. Used for pasted, dropped and chosen files. Without it, images are embedded as data URLs and attachments are refused |
| `accept`, `attachmentAccept`, `maxFileSize` | Allowed image types, allowed attachment types, size limit in bytes |
| `maxLength` | Character limit with a live counter |
| `readonly`, `disabled`, `required`, `name` | Works in a `<form>`: `name` submits the HTML, `required` uses the browser's own validation |
| `minHeight`, `maxHeight` | Sizing; the area scrolls past `maxHeight` |

Methods: `getContentHTML()`, `getContentJSON()`, `getContentText()`, `setContent()`, `insertContent()`, `clear()`, `focusEditor()`,
and `getEditor()`, which returns the underlying Tiptap editor for anything not exposed here.
Events: `uiChange` (HTML), `uiFocus`, `uiBlur`, `uiReady`, `uiUploadStart`, `uiUploadComplete`, `uiUploadError`.

The toolbar is built from Nova buttons, tooltips, menus, popovers and icons, so it follows your theme
and dark mode. Toolbar keyboard use: one tab stop, arrow keys move between buttons. Tables get a contextual
"Table" menu (insert/delete rows and columns, header row).

**Security: the value is HTML. Sanitise it on your server before you store or render it elsewhere**
(for example with DOMPurify or your backend's sanitiser). The editor blocks `javascript:` links and unsafe
image sources on the way in, but you should never trust HTML that came from a browser.

Design notes: the editor renders in light DOM (not a shadow root) because ProseMirror's selection, IME and
spellcheck behave best there; all its CSS is prefixed `nova-ed` so it can't leak into your page. Tiptap is
pinned to v2.

## CSS library: `@nova-ui/css`

Use Nova as a plain CSS library, with or without the web components. Layout primitives
(`nova-container`, `nova-grid`, `nova-grid-auto`, `nova-stack`, `nova-sidebar`, `nova-switcher`, `nova-shell`...),
responsive utilities (`nova-md-cols-3`, `nova-hide-below-md`), container queries (`nova-cq-md-cols-2`), CSS-only
components and print styles, all mobile first and cascade-layered so your CSS always wins.

```html
<link rel="stylesheet" href="/node_modules/@nova-ui/css/dist/nova.min.css">
<div class="nova-container"><ul class="nova-grid-auto nova-grid-auto-md" role="list">...</ul></div>
```
Start with `packages/css/GUIDELINES.md` (breakpoints, which layout tool to use, recipes, accessibility), or open
`packages/css/docs/index.html` for a live, resizable version. Light-theme colours are verified to WCAG AA by the build.

## First run

```bash
pnpm install
pnpm build          # builds core, then generates + builds the React and Angular wrappers
pnpm dev:vite       # or: pnpm dev:next
```

Rename the npm scope before publishing: `pnpm rename-scope @your-scope`.

## Usage

### Vite or plain HTML (no framework)

```ts
import '@nova-ui/core/styles.css';
import { defineCustomElements } from '@nova-ui/core/loader';
defineCustomElements();
```
```html
<ui-button variant="primary"><ui-icon slot="start" name="check"></ui-icon>Save</ui-button>
```

### React / Vite + React

```tsx
import '@nova-ui/core/styles.css';
import { UiButton, UiIcon, UiThemeToggle, useTheme } from '@nova-ui/react';

<UiButton onClick={save}><UiIcon slot="start" name="check" />Save</UiButton>
```

### Next.js (App Router)

```tsx
// app/layout.tsx
import '@nova-ui/core/styles.css';
import { themeInitScript } from '@nova-ui/react/server';

<html lang="en" suppressHydrationWarning>
  <head><script dangerouslySetInnerHTML={{ __html: themeInitScript }} /></head>
  <body className="nova-base">{children}</body>
</html>
```
`@nova-ui/react` ships with `"use client"`, so its components can be used from any file.

### Angular (standalone)

```ts
import { UiButton, UiIcon, ThemeService } from '@nova-ui/angular';

@Component({
  standalone: true,
  imports: [UiButton, UiIcon],
  template: `<ui-button (click)="theme.set('dark')">Dark</ui-button>`,
})
export class Demo { theme = inject(ThemeService); }
```
Add `"styles": ["node_modules/@nova-ui/core/dist/nova-ui/nova-ui.css"]` to `angular.json`.

## Theming

Everything is a CSS variable (`--nova-color-accent`, `--nova-radius-control`, ...). Override on `:root`
or any subtree. Modes: `light`, `dark`, `system`, set with `setThemeMode()`, `useTheme()` or `ThemeService`.

## Publishing

```bash
pnpm changeset            # describe the change; pick a bump
pnpm version-packages     # applies versions + changelogs (core/react/angular move together)
pnpm release              # builds, then publishes to npm
```
Log in first (`npm login`); scoped packages publish publicly via `publishConfig.access`.

## Added in this round (not yet compiled by Stencil)

| Feature | Component or helper | Tests |
| --- | --- | --- |
| Confirm / prompt dialogs | `confirm()`, `prompt()`, `<ui-dialog-host>` | queue model |
| Sanitised HTML | `<ui-html>`, `sanitizeHTML()` | 11 security tests, real DOM |
| Form field wrapper | `<ui-field>` | describedby rule |
| Date range picker | `<ui-date-range-picker>`, presets | 8 |
| Time picker | `<ui-time-picker>`, `utils/time` | 6 |
| File upload | `<ui-file-upload>`, `utils/files` | 7 |
| Sidebar navigation | `<ui-sidebar>`, `<ui-sidebar-item>` | 4 |
| Charts | `<ui-chart>` (line, area, bar, donut), `<ui-sparkline>`, `utils/chart` | 13 |
| CSV export | `ui-table` `exportable`, `utils/csv` (formula-injection guard) | 7 |
| Theme generator | `generateTheme()`, `themeToCSS()` (AA guaranteed) | 26 |
| Translatable strings | `setMessages()`, `t()` (94 keys) | 4 |

Run `pnpm --filter @nova-ui/core test` for the logic suite. Components are verified by type-check only so far.

## Ecosystem (this round)

| Package or tool | What it is | Verified here |
| --- | --- | --- |
| `packages/core/dist-docs/` | API reference (`API.md`), machine manifest (`custom-elements.json`), editor autocomplete (`vscode-html-data.json`) | generated and tested (5 tests) |
| `packages/tailwind` | Tailwind preset: `bg-nova-accent`, `rounded-nova-control`, etc., resolving to the live theme tokens | every token reference checked against `nova.css` (3 tests) |
| `packages/vue` | Vue 3 wrappers for all 71 components, generated from the manifest | output parses as TypeScript (3 tests); not run against Vue |
| `apps/playground-angular` | Standalone Angular 19 app using the Angular wrappers | not built here (no Angular installed) |
| `.github/workflows/ci.yml` | Install, build, test, browser tests, docs freshness check | not run here |

Regenerate docs and Vue wrappers with `pnpm docs`.

## Playgrounds

| App | Run | What it shows |
| --- | --- | --- |
| `apps/playground-vite` | `pnpm dev:vite` | Every component and feature, as a catalogue |
| `apps/playground-react` | `pnpm dev:react` | An app pattern: server-paged table, dialogs, validated form, dashboard |
| `apps/playground-next` | `pnpm dev:next` | App Router: client features, editor loaded client-only, page blocks |
| `apps/playground-angular` | `pnpm dev:angular` | Standalone Angular components, signals, dialogs (not yet compiled in this environment) |

`pnpm playgrounds:check` verifies that every component, prop, event and class the playgrounds use exists.

