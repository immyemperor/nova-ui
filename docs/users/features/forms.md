# Forms

Form controls submit with a surrounding `<form>`, report `required` through the browser, and reset with the form. Give every control a `name`.

## Text

```html
<ui-input name="email" type="email" label="Email" hint="We never share it" required></ui-input>
<ui-input name="code" label="Code" error="Enter the full code"></ui-input>
<ui-textarea name="bio" label="Bio" maxlength="160" autoresize></ui-textarea>
```

- `label` is required for accessibility. Use `hide-label` to keep it for screen readers only.
- `hint` explains; `error` replaces the hint and marks the field invalid.
- Events: `ui-input` on every keystroke, `ui-change` when the value is committed.
- `ui-input` accepts `prefix` and `suffix` slots for icons.

## Choices

```html
<ui-checkbox name="terms" required>I agree</ui-checkbox>
<ui-switch name="digest" checked>Weekly digest</ui-switch>

<ui-radio-group name="plan" label="Plan" value="team">
  <ui-radio value="solo">Solo</ui-radio>
  <ui-radio value="team">Team</ui-radio>
  <ui-radio value="org" disabled>Organisation</ui-radio>
</ui-radio-group>
```

- `ui-radio-group` handles arrow keys and selection; the group is the form control.
- A checkbox with no visible text needs `label` for its accessible name.

## Ranges and ratings

```html
<ui-slider name="volume" label="Volume" min="0" max="100" step="5" show-value></ui-slider>
<ui-rating name="score" max="5" label="Rate this"></ui-rating>
```

## Codes and tags

```html
<ui-otp-input name="otp" length="6" label="Verification code"></ui-otp-input>
<ui-tag-input name="emails" label="Invite"></ui-tag-input>
```

- `ui-otp-input` auto-advances, accepts paste, and supports SMS autofill. Set `type="alphanumeric"` if needed.
- `ui-tag-input` accepts Enter, comma or paste. Set a `validate` function (a property) that returns `true` or an error string; rejected tags fire `ui-reject`.

```js
tags.validate = (tag) => /^\S+@\S+\.\S+$/.test(tag) || 'Enter a valid email.';
```

## Your own control: `ui-field`

Wrap any control that has no label of its own, to get a label, hint, error and `aria-describedby`:

```html
<ui-field label="Region" hint="Used for billing">
  <select name="region"><option>UK</option><option>India</option></select>
</ui-field>
```

## Validation

Required fields use the browser's validation. For custom rules, check your own values and pass an `error` string back into the component.

```tsx
<UiInput name="email" label="Email" error={email && !email.includes('@') ? 'Enter a valid email' : undefined} />
```

## Submitting

```ts
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
});
```
