# Overlays

Overlays float above the page: dialogs, drawers, menus, tooltips and notifications. They handle focus, Escape and outside clicks for you.

## Modal and drawer

```html
<ui-modal open heading="Delete project?" size="sm">
  This removes every file in it.
  <div slot="footer">
    <ui-button variant="ghost">Cancel</ui-button>
    <ui-button variant="danger">Delete</ui-button>
  </div>
</ui-modal>

<ui-drawer open side="right" heading="Filters">…</ui-drawer>
```

- Set `open` to show; the modal emits `ui-close` when dismissed. Keep your state in sync with that event.
- Focus is trapped inside while open, and returns to the trigger on close.
- `size`: `sm`, `md`, `lg` or `full`. Drawers take `side` of `left`, `right`, `top` or `bottom`.
- Set `dismissible="false"` only when the user must choose an action.

## Confirm and prompt

For the common case, skip the modal entirely:

```ts
import { confirm, prompt } from '@nova-ui/core';

if (await confirm({ title: 'Delete project?', message: 'This cannot be undone.', confirmLabel: 'Delete', danger: true })) {
  // delete
}

const name = await prompt({
  title: 'Rename',
  defaultValue: current,
  validate: (v) => (v.length < 3 ? 'Use at least 3 characters.' : undefined),
});
```

Requests queue, so two dialogs never overlap. `confirm` resolves `true` or `false`; `prompt` resolves the text or `null` when cancelled.

## Popover, tooltip

```html
<ui-popover placement="bottom-start" label="Share">
  <ui-button slot="trigger">Share</ui-button>
  <p>Anyone with the link can view.</p>
</ui-popover>

<ui-tooltip content="Saved 2 minutes ago" placement="top">
  <ui-button variant="ghost">Status</ui-button>
</ui-tooltip>
```

Popovers render in the browser's top layer, so `overflow: hidden` parents can't clip them.

## Menus

```html
<ui-dropdown>
  <ui-button slot="trigger">Actions</ui-button>
  <ui-menu-item value="rename">Rename</ui-menu-item>
  <ui-menu-item value="delete" tone="danger" divider>Delete</ui-menu-item>
</ui-dropdown>

<ui-context-menu>
  <div>Right-click me</div>
  <ui-menu-item slot="menu" value="copy">Copy</ui-menu-item>
</ui-context-menu>
```

- Arrow keys, Home and End move; typing jumps to a matching item; Enter chooses; Escape closes.
- The chosen item arrives in `ui-select` as `{ value, label }`.

## Searchable select

```html
<ui-select name="owner" label="Owner" searchable clearable></ui-select>
```

```js
select.options = [{ value: 'ada', label: 'Ada Lovelace' }, { value: 'grace', label: 'Grace Hopper' }];
```

Options are a property, not an attribute.

- Single or `multiple` selection. Multiple shows removable chips.
- Filtering is built in. For server-side search set `filter="false"` and load options on `ui-search`.

## Command palette

```html
<ui-command-palette hotkey="mod+k"></ui-command-palette>
```

Set `commands` to an array of `{ id, label, group, icon, shortcut, keywords }`. `mod` is Cmd on macOS and Ctrl elsewhere. Chosen commands fire `ui-select`.

## Notifications

```ts
import { toast } from '@nova-ui/core';

toast.success('Saved');
toast.error({ title: 'Upload failed', description: 'Check your connection.', actionLabel: 'Retry', onAction: retry });
const { id, dismiss } = toast.info('Syncing…', { duration: 0 });
```

Render `<ui-toaster>` once near the root. Toasts pause while hovered and sit above open dialogs.
