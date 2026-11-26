import { LoginBlock, PricingBlock, UiCard, UiButton, UiBadge, UiIcon, UiReveal, UiStagger, UiThemeToggle } from '@kvui/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { NewFeatures } from './_features/NewFeatures';
import { SourceFile } from './_features/CodeBlock';
import { IconSetToggle } from './_features/IconSetToggle';

// Read on the server at build or request time, so the client bundle does not carry these files.
const source = (rel: string) => readFileSync(join(process.cwd(), rel), 'utf8');

// Server component: the static parts render on the server; interactive parts are client components.
const features = [
  { title: 'Server rendered shell', text: 'Layout classes are plain CSS, so the structure is correct before any JavaScript runs.' },
  { title: 'No flash of theme', text: 'The theme is set before first paint, in light, dark or system mode.' },
  { title: 'Fits every screen', text: 'Grids add and remove columns as space allows, with no breakpoints.' },
];

export default function Home() {
  return (
    <>
      <a className="kvui-skip-link" href="#main">Skip to content</a>
      <header className="kvui-bg-surface kvui-border-b">
        <div className="kvui-container kvui-cluster kvui-cluster-between kvui-py-3">
          <strong>Kvui UI on Next.js</strong>
          <div className="kvui-cluster">
            <a className="kvui-btn kvui-btn-ghost kvui-btn-sm" href="/components">Components</a>
            <a className="kvui-btn kvui-btn-ghost kvui-btn-sm" href="/icons/material">Icons</a>
            <IconSetToggle />
            <UiThemeToggle />
          </div>
        </div>
      </header>

      <main id="main" className="kvui-container kvui-section kvui-stack kvui-stack-lg">
        <div className="kvui-stack">
          <p className="kvui-eyebrow">App Router</p>
          <h1 className="kvui-display">Layouts that fit every screen</h1>
          <p className="kvui-lead">Web components for behaviour, @kvui/css for layout.</p>
          <div className="kvui-cluster">
            <UiButton>
              <UiIcon slot="start" name="check" />
              Save changes
            </UiButton>
            <UiButton variant="secondary">Learn more</UiButton>
            <UiBadge tone="accent">v0.1</UiBadge>
          </div>
        </div>

        <ul className="kvui-grid-auto kvui-grid-auto-md" role="list">
          {features.map((f) => (
            <li key={f.title}>
              <UiCard variant="raised">
                <div className="kvui-stack kvui-stack-sm">
                  <h2 className="kvui-h5">{f.title}</h2>
                  <p className="kvui-small kvui-text-muted">{f.text}</p>
                </div>
              </UiCard>
            </li>
          ))}
        </ul>

        <UiStagger>
          <p>Rendered in the App Router.</p>
          <p>The theme is set before first paint, so there is no flash.</p>
        </UiStagger>

        <NewFeatures />

        <section className="kvui-stack kvui-stack-sm">
          <h2 className="kvui-h4">Page blocks</h2>
          <LoginBlock />
          <PricingBlock tiers={[
            { name: 'Free', price: '$0', period: '/month', features: ['1 project'] },
            { name: 'Team', price: '$24', period: '/month', features: ['Unlimited projects', 'SSO'], featured: true },
          ]} />
        </section>

        <section className="kvui-stack kvui-stack-sm" id="source">
          <h2 className="kvui-h4">Source code</h2>
          <p className="kvui-caption">The client features and this page are plain React. Open a file to copy it.</p>
          <SourceFile title="app/page.tsx" code={source('app/page.tsx')} />
          <SourceFile title="app/_features/NewFeatures.tsx" code={source('app/_features/NewFeatures.tsx')} />
        </section>

        <section className="kvui-section-lg">
          <UiReveal animation="fade">
            <p>Revealed on scroll.</p>
          </UiReveal>
        </section>
      </main>
    </>
  );
}
