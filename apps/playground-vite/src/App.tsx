import { FormEvent, useState } from 'react';
import {
  UiAlert, UiAvatar, UiBadge, UiButton, UiCard, UiCheckbox, UiCounter, UiIcon, UiInput, UiProgress,
  UiRadio, UiRadioGroup, UiRating, UiReveal, UiSkeleton, UiSlider, UiSpinner, UiStagger, UiSwitch,
  UiTextarea, UiThemeToggle, useTheme,
} from '@nova-ui/react';
import { NavDemo } from './NavDemo';
import { OverlayDemo } from './OverlayDemo';
import { PhaseFourDemo } from './PhaseFourDemo';

export function App() {
  const { mode, resolved } = useTheme();
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState('');
  const [volume, setVolume] = useState(40);
  const [submitted, setSubmitted] = useState<Record<string, string> | null>(null);
  const [alertOpen, setAlertOpen] = useState(true);

  const emailError = email && !email.includes('@') ? 'Enter an email address like name@example.com.' : undefined;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Nova form controls take part in native FormData.
    setSubmitted(Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>);
    setSaving(true);
    setTimeout(() => setSaving(false), 900);
  };

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1rem', display: 'grid', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.375rem' }}>Nova UI playground</h1>
        <UiThemeToggle />
      </header>
      <p style={{ margin: 0, color: 'var(--nova-color-fg-muted)' }}>
        Theme mode: <strong>{mode}</strong> (showing {resolved}).
      </p>

      {alertOpen && (
        <UiAlert tone="info" heading="Phase 2 components" dismissible onUiDismiss={() => setAlertOpen(false)}>
          Form controls and display components are ready to try.
        </UiAlert>
      )}

      <UiCard variant="raised">
        <span slot="header">Profile settings</span>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
          <UiInput
            name="email" type="email" label="Email" required placeholder="name@example.com"
            hint="We only use this for receipts." error={emailError}
            onUiInput={(e) => setEmail(e.detail)}
          >
            <UiIcon slot="prefix" name="search" />
          </UiInput>
          <UiTextarea name="bio" label="Short bio" maxlength={160} autoresize rows={2} />
          <UiRadioGroup name="plan" label="Plan" value="team">
            <UiRadio value="solo">Solo</UiRadio>
            <UiRadio value="team">Team</UiRadio>
            <UiRadio value="org" disabled>Organisation (contact us)</UiRadio>
          </UiRadioGroup>
          <UiSlider name="volume" label="Notification volume" showValue value={volume} onUiInput={(e) => setVolume(e.detail)} />
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <UiCheckbox name="terms" required>I agree to the terms</UiCheckbox>
            <UiSwitch name="digest" checked>Weekly digest</UiSwitch>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Rate this form</span>
            <UiRating label="Rate this form" value={4} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <UiButton type="submit" loading={saving}>Save changes</UiButton>
            <UiButton type="reset" variant="ghost">Reset</UiButton>
          </div>
        </form>
        <div slot="footer" style={{ fontSize: '0.75rem', fontFamily: 'var(--nova-font-mono)', overflowWrap: 'anywhere' }}>
          {submitted ? JSON.stringify(submitted) : 'Submit to see the FormData.'}
        </div>
      </UiCard>

      <section style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <UiAvatar name="Ada Lovelace" />
        <UiAvatar name="Grace Hopper" shape="square" />
        <UiAvatar src="/missing.png" name="Linus T" />
        <UiBadge tone="success" dot>Active</UiBadge>
        <UiBadge tone="warning" variant="outline">Pending</UiBadge>
        <UiBadge tone="danger" variant="solid">Failed</UiBadge>
        <UiSpinner label="Syncing" />
      </section>

      <section style={{ display: 'grid', gap: '1rem' }}>
        <UiProgress label="Upload" value={64} showValue />
        <UiProgress label="Processing" />
        <div aria-busy="true" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1rem', alignItems: 'center' }}>
          <UiSkeleton shape="circle" width="3rem" />
          <UiSkeleton lines={2} />
        </div>
      </section>

      <UiStagger step={70}>
        <p>
          <UiCounter value={12840} locale="en-US" /> components rendered.
        </p>
        <p>
          <UiCounter value={99.9} decimals={1} suffix="%" /> uptime.
        </p>
      </UiStagger>

      <NavDemo />

      <OverlayDemo />

      <PhaseFourDemo />

      <div style={{ height: '40vh' }} />
      <UiReveal animation="fade">
        <p>This block appears when you scroll to it.</p>
      </UiReveal>
    </main>
  );
}
