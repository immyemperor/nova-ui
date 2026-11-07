'use client';

import { UiButton, UiIcon, UiReveal, UiStagger, UiThemeToggle, useTheme } from '@nova-ui/react';

export default function Home() {
  const { mode, resolved } = useTheme();
  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1rem', display: 'grid', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.375rem' }}>Nova UI on Next.js</h1>
        <UiThemeToggle />
      </header>
      <p style={{ margin: 0, color: 'var(--nova-color-fg-muted)' }}>
        Theme mode: <strong>{mode}</strong> (showing {resolved}).
      </p>
      <UiButton>
        <UiIcon slot="start" name="check" />
        Save changes
      </UiButton>
      <UiStagger>
        <p>Rendered in the App Router.</p>
        <p>The theme is set before first paint, so there is no flash.</p>
      </UiStagger>
      <div style={{ height: '60vh' }} />
      <UiReveal animation="fade">
        <p>Revealed on scroll.</p>
      </UiReveal>
    </main>
  );
}
