import type { ReactNode } from 'react';
import '@nova-ui/core/styles.css';
import { themeInitScript } from '@nova-ui/react/server';

export const metadata = { title: 'Nova UI - Next.js playground' };

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
