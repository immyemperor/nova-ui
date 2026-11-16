# Accessibility

Nova targets WCAG 2.2 AA. Components handle roles, states, focus and keyboard use. You supply the names and the content.

## What the components do for you

- Keyboard operation for every interactive component (arrow keys for lists, tabs, menus, grids, sliders, ratings; Enter and Space to activate; Escape to dismiss).
- Visible focus indicators, drawn with outlines that also show in Windows High Contrast mode.
- Roles and states: `aria-expanded`, `aria-selected`, `aria-current`, `aria-invalid`, `aria-describedby` linked to hints and errors.
- Focus management: modals trap focus and return it; menus move focus to the first item; toasts announce politely and errors assertively.
- Reduced motion: transitions and continuous animations stop or shorten.
- Touch targets of at least 44px on touch screens.
- Text colours and control borders meet contrast minimums in light and dark themes (checked on every build).

## What you must do

1. **Name everything.** Each input needs a `label` (or `hide-label` for visually hidden text). Each icon-only button needs a `label`.
2. **Use real structure.** One `<h1>` per page, headings in order, landmarks (`<main>`, `<nav>`) around content. Add `nova-skip-link` as the first focusable element.
3. **Describe charts.** Give each chart a meaningful `label`; the component adds the summary and data table.
4. **Don't rely on colour alone.** Pair status with text or an icon (`ui-badge` with `tone` and text).
5. **Keep focus visible.** Don't remove outlines on Nova elements.
6. **Test with the keyboard** from start to finish of every flow, and with a screen reader on at least one.

## Zoom and reflow

Layouts work at 320 CSS pixels wide and at 400 percent zoom with no sideways scrolling, except tables and code. Never disable zoom in the viewport meta tag.

## Known gaps

- Drag-and-drop lists and boards have keyboard alternatives, but the drag itself isn't announced to screen readers. Test with your audience.
- The rich text editor's suggestion popup is not yet announced as a linked combobox.
- Forced-colours (Windows High Contrast) styling is in place but hasn't been tested on Windows yet.
