# Nova UI

One component library for **React, Next.js, Vite and Angular**. Components are built once as web
components with [Stencil](https://stenciljs.com); typed React and Angular wrappers are generated from them.

```
packages/
  core/      @nova-ui/core     web components, design tokens, theme manager, icons, motion
  react/     @nova-ui/react    generated React wrappers + useTheme()  (Next.js ready)
  angular/   @nova-ui/angular  generated standalone proxies + ThemeService
apps/
  playground-vite/             Vite + React demo
  playground-next/             Next.js App Router demo
```

## Status: Phases 1 to 4

| Area | Included |
| --- | --- |
| Foundation | tokens, light/dark/system theme manager, no-flash script, icon registry |
| Motion | `animateIn`, `staggerIn`, `<ui-reveal>`, `<ui-stagger>` (all honour reduced motion) |
| Components (1) | `ui-button`, `ui-icon`, `ui-theme-toggle` |
| Form controls (2) | `ui-input`, `ui-textarea`, `ui-checkbox`, `ui-radio-group` + `ui-radio`, `ui-switch`, `ui-slider`, `ui-rating` |
| Display (2) | `ui-card`, `ui-badge`, `ui-avatar`, `ui-alert`, `ui-skeleton`, `ui-spinner`, `ui-progress`, `ui-counter` |
| Data and complex inputs (4) | `ui-table`, `ui-tree`, `ui-carousel`, `ui-marquee`, `ui-date-picker`, `ui-color-picker`, `ui-otp-input`, `ui-tag-input` |

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
| `ui-table` | Sortable columns, row selection and an accessible empty state; supply `columns` and `rows` as properties. |
| `ui-tree` | Nested `TreeNode[]`, keyboard navigation, selection and controlled expansion. |
| `ui-carousel` | Default-slot slides, loop control, indicators and optional autoplay. |
| `ui-marquee` | Duplicated decorative slot content, configurable direction/speed and reduced-motion support. |
| `ui-date-picker` | Calendar popover with ISO `YYYY-MM-DD` value, min/max bounds and form participation. |
| `ui-color-picker` | Native color well with editable 3- or 6-digit hex value and form participation. |
| `ui-otp-input` | Segmented numeric/alphanumeric entry, one-time-code autofill and paste distribution. |
| `ui-tag-input` | Token entry, comma/Enter commit, keyboard removal and optional suggestions. |

The table takes `{ key, label, sortable?, align? }` columns and object rows. The tree takes
`{ id, label, children?, disabled? }` nodes. Complex arrays are passed as JavaScript properties,
not serialized HTML attributes. `uiChange` emits the new value or selection; data widgets also
emit `uiSort`, `uiSelectionChange`, `uiSelect`, or `uiExpandChange` where relevant.

Phase 5 (rich text editor) remains planned.

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
