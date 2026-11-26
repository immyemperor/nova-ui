# Troubleshooting

Symptom, likely cause, fix. If your problem isn't here, check the browser console first: most problems log a clear message.

## The component renders as plain text or an empty box

- **Stylesheet not imported.** Add `@import '@kvui/css/kvui.css';` once in your app.
- **Component not registered.** In plain HTML, call `defineCustomElements()` from `@kvui/core/loader`. In React and Angular the wrappers register components when imported; if you see `not defined`, import the loader once in your entry file.
- **Wrong tag name.** Tags are `ui-` followed by the kebab-case name: `ui-date-picker`, not `ui-datepicker`.

## "`<ui-toaster>` is not registered" when calling `toast()`

Render `<UiToaster />` (or `<ui-toaster>`) once near the root of your app. `toast()` creates one automatically in most cases, but the warning means it wasn't ready. Check that the component is imported.

## Dark mode flashes on page load

Add the theme script before your stylesheet in `<head>`. In Next.js use `themeInitScript` from `@kvui/react/server` in the root layout (see [Next.js](frameworks/nextjs.md)).

## Form values are missing on submit

- Give the control a `name`.
- Make sure the control is inside a `<form>`.
- For React, read values with `new FormData(event.currentTarget)` or from your own state via `onUiChange`.

## Angular form binding does nothing

Use `ngModel` or `formControl` with the Kvui form controls. They provide value accessors automatically. If you bind with `[value]` and `(uiChange)`, update your model in the handler.

## Table rows are not sorted or filtered in server mode

Set `manual` and handle `uiQueryChange`. In manual mode the table shows the rows you pass; it does not sort or filter them.

## Table is slow with thousands of rows

Enable `virtual` with a `maxHeight` and a fixed `rowHeight`. Turn off `paginate` for a single long scrollable list. See [Data tables](features/data-tables.md).

## Chart shows no data

The `series` values must be numbers. Strings like `"12"` are ignored. Check that `labels` has one entry per value.

## Editor content is lost or unsafe

The editor's value is HTML. Store it as HTML, sanitise it before rendering it anywhere else, and load it back with `setContent()` or the `value` prop. Uploads need an `uploadHandler`; without one, images are embedded as data URLs and attachments are refused.

## Focus ring is missing or doubled

Focus rings are drawn by the component. Don't add your own `outline: none` to Kvui elements. If a focusable element you built yourself shows a double ring, add `class="hydrated"` only to Kvui components; the reset leaves custom elements alone.

## Text is not translated

Call `setMessages()` before the first render, and use keys from `DEFAULT_MESSAGES` (exported from `@kvui/core`).

## Tailwind classes have no effect

Add the preset to `tailwind.config.js` and include the Kvui paths in `content` if you use components with Tailwind classes. Classes such as `bg-kvui-accent` need the preset loaded.

## Something still broken

1. Note the component tag, framework and version.
2. Copy the minimal code that reproduces it.
3. Open an issue with those three items. Maintainers can use the test harness in [Testing](../humans/testing.md) to reproduce it.
