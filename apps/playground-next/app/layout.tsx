import type { ReactNode } from 'react';
import type { Viewport } from 'next';
// One stylesheet: tokens, reset, layout classes, utilities. (Replaces @nova-ui/core/styles.css.)
import '@nova-ui/css/nova.css';
import { themeInitScript } from '@nova-ui/react/server';

export const metadata = { title: 'Nova UI - Next.js playground' };

// viewport-fit=cover lets .nova-container keep content clear of notches. Never disable zoom.
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script sets data-theme before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="nova-base">{children}</body>
    </html>
  );
}
