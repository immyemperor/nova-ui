import type { ReactNode } from 'react';
import type { Viewport } from 'next';
// One stylesheet: tokens, reset, layout classes, utilities. (Replaces @omni/core/styles.css.)
import '@omni/css/nova.css';
import './playground.css';
import { themeInitScript } from '@omni/react/server';

export const metadata = { title: 'Nova UI - Next.js playground' };

// viewport-fit=cover lets .nova-container keep content clear of notches. Never disable zoom.
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script sets data-theme before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/nova-icons.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="nova-base">{children}</body>
    </html>
  );
}
