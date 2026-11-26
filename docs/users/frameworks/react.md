# React

Works with React 18 and 19. Components are wrapped so props and events look like normal React.

## Install

```bash
pnpm add @kvui/core @kvui/css @kvui/react
```

Import the stylesheet in your entry file, once:

```tsx
// src/main.tsx
import '@kvui/css/kvui.css';
import { App } from './App';
```

## Use components

```tsx
import { useState } from 'react';
import { UiButton, UiInput, UiSelect, UiCard, toast } from '@kvui/react';

export function Profile() {
  const [owner, setOwner] = useState('');
  return (
    <UiCard variant="raised">
      <UiInput label="Email" name="email" type="email" required />
      <UiSelect
        label="Owner"
        searchable
        value={owner}
        options={[{ value: 'ada', label: 'Ada Lovelace' }, { value: 'grace', label: 'Grace Hopper' }]}
        onUiChange={(e) => setOwner(String(e.detail))}
      />
      <UiButton onClick={() => toast.success('Saved')}>Save</UiButton>
    </UiCard>
  );
}
```

Events are `onUi<Name>` with the payload in `e.detail`. Props that take objects (`options`, `columns`, `rows`, `series`) are plain JavaScript values.

## Forms

Give each control a `name` inside a `<form>`, then read the values from `FormData`:

```tsx
<form onSubmit={(e) => { e.preventDefault(); const data = Object.fromEntries(new FormData(e.currentTarget)); }}>
  <UiInput name="email" label="Email" required />
  <UiButton type="submit">Send</UiButton>
</form>
```

Controls with values also accept `value` and `onUiChange` if you prefer controlled state.

## Hooks and helpers

| Export | Use |
| --- | --- |
| `useTheme()` | Current mode and resolved theme, plus `setMode` |
| `usePresence(open, ms)` | Keep an element mounted while it animates out |
| `toast`, `confirm`, `prompt` | Notifications and dialogs |
| `generateTheme`, `themeToCSS` | Build a brand palette |
| `contrastRatio`, `niceTicks`, `compact` | Utilities used by charts and theming |

## Exit animations

```tsx
import { usePresence, UiCard } from '@kvui/react';

const { mounted, phase } = usePresence(open, 180);
{mounted && <UiCard className={phase === 'exiting' ? 'fade-out' : 'fade-in'}>…</UiCard>}
```

`ms` must match your CSS exit animation. Users who prefer reduced motion are removed immediately.

## The rich text editor

```tsx
import { UiEditor } from '@kvui/react/editor';
```

It's a separate entry point, so it only loads where you import it. See [Rich text editor](../features/editor.md).

## Page blocks

```tsx
import { LoginBlock, PricingBlock, DashboardBlock, SettingsBlock, OnboardingBlock } from '@kvui/react';
```

Copy and adapt them. See [Page blocks](../features/page-blocks.md).

## Gotchas

- **Event names**: use `onUiChange`, not `onChange`. The native `onChange` still works on native inputs.
- **Server rendering**: components render on the client. Use `'use client'` in Next.js (see [Next.js](nextjs.md)).
- **Refs**: call methods through the element ref, for example `ref.current.focusInput()`.
