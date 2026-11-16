# Feedback and status

Components that show state: whether something is happening, whether it worked, and what the numbers are.

## Alerts

```html
<ui-alert tone="success" heading="Saved">Your changes are live.</ui-alert>
<ui-alert tone="danger" heading="Could not save" dismissible>Check your connection and try again.</ui-alert>
```

- `tone`: `info`, `success`, `warning` or `danger`. Danger and warning are announced assertively; the others politely.
- `dismissible` adds a close button. Event: `ui-dismiss`.
- Pair the tone with the text. Colour alone isn't enough.

## Badges

```html
<ui-badge tone="success" dot>Active</ui-badge>
<ui-badge tone="warning" variant="outline">Pending</ui-badge>
<ui-badge tone="danger" variant="solid">Failed</ui-badge>
```

Tones: `neutral`, `accent`, `success`, `warning`, `danger`, `info`. Variants: `soft` (default), `solid`, `outline`.

## Avatars

```html
<ui-avatar name="Ada Lovelace"></ui-avatar>
<ui-avatar src="/people/ada.jpg" name="Ada Lovelace" shape="square" size="lg"></ui-avatar>
```

Shows initials when there's no image or the image fails to load. `name` is the accessible name.

## Loading states

```html
<ui-spinner label="Saving"></ui-spinner>
<ui-progress label="Upload" value="64" show-value></ui-progress>
<ui-progress label="Processing"></ui-progress>
<ui-skeleton lines="3"></ui-skeleton>
```

- Spinner: `label` is announced. Use it for short waits.
- Progress: pass `value`. Leave it unset for an indeterminate bar when you don't know the total.
- Skeleton: placeholder shapes while content loads. Mark the loading region with `aria-busy="true"` on its container.

## Counters

```html
<ui-counter value="12840" locale="en-US"></ui-counter>
<ui-counter value="99.9" decimals="1" suffix-text="%"></ui-counter>
```

Counts up when it becomes visible. Users who prefer reduced motion see the final number straight away.

## Cards

```html
<ui-card variant="raised">
  <span slot="header">Profile</span>
  <p>Card body.</p>
  <div slot="footer">…</div>
</ui-card>
```

- `variant`: `outlined` (default), `raised` or `flat`.
- `interactive` adds hover and focus states. Wrap the card in a link or button for the actual action.

## Dialogs and notifications

For confirmations, prompts and toasts see [Overlays](overlays.md).
