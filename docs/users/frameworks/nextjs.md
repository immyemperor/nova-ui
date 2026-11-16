# Next.js (App Router)

Nova works with the App Router and the Pages Router. Components are client components, so they run in the browser; the layout and the theme script run on the server.

## Install

```bash
pnpm add @nova-ui/core @nova-ui/css @nova-ui/react
```

## Root layout: stylesheet, theme script, no flash

```tsx
// app/layout.tsx
import type { ReactNode } from 'react';
import '@nova-ui/css/nova.css';
import { themeInitScript } from '@nova-ui/react/server';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: the script sets data-theme before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="nova-base">{children}</body>
    </html>
  );
}
```

For a safe viewport on phones add it to `app/layout.tsx`:

```tsx
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };
```

## Using components

Mark any file that uses Nova components as a client component:

```tsx
'use client';

import { UiButton, UiCard, useTheme } from '@nova-ui/react';

export default function Page() {
  const { mode, resolved } = useTheme();
  return <UiCard><UiButton>Save</UiButton></UiCard>;
}
```

Components can be imported from server files, because the package is marked `"use client"` in its build. Hooks (`useTheme`, `usePresence`) and event handlers still need a client component.

## Editor in Next.js

```tsx
'use client';
import dynamic from 'next/dynamic';
const UiEditor = dynamic(() => import('@nova-ui/react/editor').then((m) => m.UiEditor), { ssr: false });
```

Loading the editor with `ssr: false` keeps Tiptap out of the server bundle.

## Gotchas

- **Hydration mismatch on theme**: keep `suppressHydrationWarning` on `<html>` and the theme script in `<head>`.
- **Charts and tables on the server**: they render their markup, but measurements (sizes, scroll) happen in the browser. Keep layout dependent on CSS, not on JavaScript measurement, when you can.
- **Server rendering of components is not yet provided by the package.** Components render their shell on the client. Stencil's hydration output is planned; until it lands, use the client-component pattern above.
