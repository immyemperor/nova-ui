import { useState } from 'react';
import { DashboardBlock, LoginBlock, OnboardingBlock, PricingBlock, SettingsBlock, UiButton, UiCard, UiSwitch, usePresence } from '@omni/react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export function BlocksDemo() {
  const [open, setOpen] = useState(true);
  const { mounted, phase } = usePresence(open, 180);
  const [step, setStep] = useState(0);

  return (
    <section className="nova-stack nova-stack-lg" id="blocks">
      <h2 className="nova-h3">Page blocks</h2>

      <div className="nova-grid-auto nova-grid-auto-md nova-gap-6">
        <LoginBlock onSubmit={(email) => console.info('sign in', email)} footer={<p className="nova-small nova-text-muted">No account? <a href="#signup">Sign up</a></p>} />
        <PricingBlock tiers={[
          { name: 'Free', price: '$0', period: '/month', features: ['1 project', 'Community support'] },
          { name: 'Team', price: '$24', period: '/month', features: ['Unlimited projects', 'Email support', 'SSO'], featured: true },
          { name: 'Enterprise', price: 'Custom', features: ['Dedicated support', 'Audit logs', 'SLA'] },
        ]} />
      </div>

      <div className="nova-stack">
        <h3 className="nova-h5">Exit animation (usePresence)</h3>
        <div className="nova-cluster">
          <UiButton variant="secondary" onClick={() => setOpen((o) => !o)}>{open ? 'Hide' : 'Show'} card</UiButton>
          <span className="nova-caption">phase: {phase}</span>
        </div>
        {mounted && (
          <UiCard className={phase === 'exiting' ? 'nova-fade-out' : 'nova-fade-in'}>
            This card fades out before it is removed from the page.
          </UiCard>
        )}
      </div>

      <OnboardingBlock step={step} steps={[{ heading: 'Account' }, { heading: 'Workspace' }, { heading: 'Invite' }]}>
        <h3 className="nova-h4">Step {step + 1} of 3</h3>
        <div className="nova-cluster">
          <UiButton variant="ghost" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>Back</UiButton>
          <UiButton onClick={() => setStep((s) => Math.min(2, s + 1))}>Next</UiButton>
        </div>
      </OnboardingBlock>

      <SettingsBlock active="notifications" sections={[
        { id: 'profile', label: 'Profile', icon: 'user' },
        { id: 'notifications', label: 'Notifications', icon: 'bell' },
        { id: 'billing', label: 'Billing', icon: 'credit-card' },
      ]}>
        <h2 className="nova-h3">Notifications</h2>
        <UiSwitch checked>Email me about new comments</UiSwitch>
        <UiSwitch>Weekly summary</UiSwitch>
      </SettingsBlock>

      <DashboardBlock
        title="Overview"
        notice="Figures update every hour."
        kpis={[
          { label: 'Revenue', value: '$128k', delta: '+12%' },
          { label: 'Users', value: '8,421', delta: '+4%', tone: 'info' },
          { label: 'Churn', value: '2.1%', delta: '+0.4%', tone: 'danger' },
        ]}
        months={months}
        series={[{ name: 'Revenue', values: [12, 18, 15, 22, 27, 31] }]}
        columns={[{ key: 'event', label: 'Event', sortable: true }, { key: 'when', label: 'When' }]}
        rows={[{ id: 1, event: 'Invoice paid', when: 'Today' }, { id: 2, event: 'New signup', when: 'Yesterday' }]}
      />
    </section>
  );
}
