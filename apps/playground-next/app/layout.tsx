import type { ReactNode } from 'react';
import type { Viewport } from 'next';
// One stylesheet: tokens, reset, layout classes, utilities. (Replaces @kvui/core/styles.css.)
import '@kvui/css/kvui.css';
import './playground.css';
import { themeInitScript } from '@kvui/react/server';

export const metadata = { title: 'Kvui UI - Next.js playground' };

// viewport-fit=cover lets .kvui-container keep content clear of notches. Never disable zoom.
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script sets data-theme before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/kvui-icons.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="kvui-base">{children}</body>
    </html>
  );
}
