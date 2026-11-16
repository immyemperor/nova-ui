import { LoginBlock, PricingBlock, UiCard, UiButton, UiBadge, UiIcon, UiReveal, UiStagger, UiThemeToggle } from '@nova-ui/react';
import { NewFeatures } from './_features/NewFeatures';

// Server component: the static parts render on the server; interactive parts are client components.
const features = [
  { title: 'Server rendered shell', text: 'Layout classes are plain CSS, so the structure is correct before any JavaScript runs.' },
  { title: 'No flash of theme', text: 'The theme is set before first paint, in light, dark or system mode.' },
  { title: 'Fits every screen', text: 'Grids add and remove columns as space allows, with no breakpoints.' },
];

export default function Home() {
  return (
    <>
      <a className="nova-skip-link" href="#main">Skip to content</a>
      <header className="nova-bg-surface nova-border-b">
        <div className="nova-container nova-cluster nova-cluster-between nova-py-3">
          <strong>Nova UI on Next.js</strong>
          <UiThemeToggle />
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
            <UiBadge tone="accent">v0.1</UiBadge>
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

        <NewFeatures />

        <section className="nova-stack nova-stack-sm">
          <h2 className="nova-h4">Page blocks</h2>
          <LoginBlock />
          <PricingBlock tiers={[
            { name: 'Free', price: '$0', period: '/month', features: ['1 project'] },
            { name: 'Team', price: '$24', period: '/month', features: ['Unlimited projects', 'SSO'], featured: true },
          ]} />
        </section>

        <section className="nova-section-lg">
          <UiReveal animation="fade">
            <p>Revealed on scroll.</p>
          </UiReveal>
        </section>
      </main>
    </>
  );
}
