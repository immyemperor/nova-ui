'use client';

import { UiBadge, UiButton, UiCard, UiIcon, UiReveal, UiStagger, UiThemeToggle, useTheme } from '@nova-ui/react';

const features = [
  { title: 'Server rendered shell', text: 'Layout classes are plain CSS, so the page structure is correct before any JavaScript runs.' },
  { title: 'No flash of theme', text: 'The theme is set before first paint, in light, dark or system mode.' },
  { title: 'Fits every screen', text: 'The grid below has no breakpoints: it adds and removes columns as space allows.' },
];

export default function Home() {
  const { mode, resolved } = useTheme();
  return (
    <>
      <a className="nova-skip-link" href="#main">Skip to content</a>
      <header className="nova-bg-surface nova-border-b">
        <div className="nova-container nova-cluster nova-cluster-between nova-py-3">
          <strong>Nova UI on Next.js</strong>
          <div className="nova-cluster">
            <UiBadge tone="accent">{mode} ({resolved})</UiBadge>
            <UiThemeToggle />
          </div>
        </div>
      </header>

      <main id="main" className="nova-container nova-section nova-stack nova-stack-lg">
        <div className="nova-stack">
          <p className="nova-eyebrow">App Router</p>
          <h1 className="nova-display">Layouts that fit every screen</h1>
          <p className="nova-lead">Web components for behaviour, @nova-ui/css for layout.</p>
          <div className="nova-cluster">
            <UiButton>
              <UiIcon slot="start" name="check" />
              Save changes
            </UiButton>
            <UiButton variant="secondary">Learn more</UiButton>
          </div>
        </div>

        <ul className="nova-grid-auto nova-grid-auto-md" role="list">
          {features.map((f) => (
            <li key={f.title}>
              <UiCard variant="raised">
                <div className="nova-stack nova-stack-sm">
                  <h2 className="nova-h5">{f.title}</h2>
                  <p className="nova-small nova-text-muted">{f.text}</p>
                </div>
              </UiCard>
            </li>
          ))}
        </ul>

        <UiStagger>
          <p>Rendered in the App Router.</p>
          <p>The theme is set before first paint, so there is no flash.</p>
        </UiStagger>

        <section className="nova-section-lg">
          <UiReveal animation="fade">
            <p>Revealed on scroll.</p>
          </UiReveal>
        </section>
      </main>
    </>
  );
}
