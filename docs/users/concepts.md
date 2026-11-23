# Concepts

These are the ideas behind the library. Knowing them prevents most problems.

## Web components underneath

Every component is a standard web component (`<ui-*>` custom element). It works without a framework, and each framework gets a thin wrapper that maps props, events and slots onto it. So the same component looks and behaves the same in React, Angular, Vue and plain HTML.

## Props, attributes and events

- **Attributes** are strings in HTML: `size="sm"`, `disabled`.
- **Props** are typed values in frameworks: `size="sm"`, `disabled={true}`, `options={[...]}`. Booleans are real booleans in frameworks.
- **Events** use the `ui` prefix and carry their payload in `detail`. `uiChange` fires when the value changes; `uiInput` fires on every keystroke or drag.

Objects and arrays (`options`, `columns`, `rows`, `series`) are passed as properties, not attributes. Frameworks do this for you. In plain HTML, set them on the element with JavaScript: `el.options = [...]`.

## Slots

Components accept content through named slots. `<ui-button>` takes `slot="start"` and `slot="end"` icons; `<ui-table>` takes `slot="cell:<rowKey>:<columnKey>"` for custom cells. Slots are listed for each component in the reference.

## Forms

Form controls (`ui-input`, `ui-select`, `ui-checkbox`, `ui-date-picker`, and so on) take part in native forms. They submit with their `name`, report `required` through the browser's own validation, and reset with the form. You don't need a custom form library.

## Theme tokens are the source of truth

Colours, spacing, radius, shadows and motion timings are CSS custom properties named `--nova-*`. Components read them, so changing one token changes the whole product, including dark mode. Override tokens; don't fork components. See [Theming](features/theming.md).

## Accessibility is built in, but you still choose labels

Components set roles, states and keyboard handling for you. You provide the text: a `label` on an input, an accessible name on an icon-only button (`label="Delete"`). A component without a name is reported as unlabelled, so always give one.

## Layout is CSS, not components

Use layout classes from `@omni/css` (`nova-container`, `nova-stack`, `nova-grid-auto`) to arrange components. Components are never responsible for page layout. See [Layout and CSS](features/layout-and-css.md).

## Optional packages stay optional

The rich text editor is a separate package because it pulls in Tiptap. Import it only where you use it. The same applies to Tailwind and Vue.

## Translations

Visible text inside components comes from a message catalogue with English defaults. Override any string with `setMessages({...})` before rendering. See [Internationalisation](features/i18n.md).

## Rules that prevent most bugs

1. **Import the stylesheet once.** Without it, components render unstyled.
2. **Give every control a name.** `label`, `aria-label` or visible text.
3. **Set `mutable` values through events.** Don't mutate a component's props directly; listen to its event and update your state.
4. **Sanitise untrusted HTML** with `<ui-html>` or `sanitizeHTML()`, never by setting `innerHTML` yourself.
5. **Use the editor's output as HTML** only after sanitising it on the server.
