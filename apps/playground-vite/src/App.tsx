import { FormEvent, useState } from 'react';
import {
  UiAlert, UiAvatar, UiBadge, UiButton, UiCard, UiCheckbox, UiCounter, UiIcon, UiInput, UiProgress,
  UiRadio, UiRadioGroup, UiRating, UiReveal, UiSkeleton, UiSlider, UiSpinner, UiStagger, UiSwitch,
  UiTextarea, UiThemeToggle, useTheme,
} from '@kvui/react';
import { SourceFile } from '../../shared/react/CodeBlock';
import { setIconLibrary, getIconLibrary } from '@kvui/react';
import type { IconLibrary } from '@kvui/react';
import appSrc from './App.tsx?raw';
import newFeaturesSrc from './NewFeaturesDemo.tsx?raw';
import featuresSrc from './FeaturesDemo.tsx?raw';
import chartsSrc from './ChartsDemo.tsx?raw';
import dataSrc from './DataDemo.tsx?raw';
import navSrc from './NavDemo.tsx?raw';
import overlaySrc from './OverlayDemo.tsx?raw';
import editorSrc from './EditorDemo.tsx?raw';
import layoutSrc from './LayoutDemo.tsx?raw';
import blocksSrc from './BlocksDemo.tsx?raw';
import cssSrc from './playground.css?raw';
import { BlocksDemo } from './BlocksDemo';
import { ChartsDemo } from './ChartsDemo';
import { DataDemo } from './DataDemo';
import { EditorDemo } from './EditorDemo';
import { FeaturesDemo } from './FeaturesDemo';
import { LayoutDemo } from './LayoutDemo';
import { NavDemo } from './NavDemo';
import { NewFeaturesDemo } from './NewFeaturesDemo';
import { OverlayDemo } from './OverlayDemo';
import { Explorer } from '../../shared/react/explorer/Explorer';
import { useRoute } from '../../shared/react/explorer/route';
import { ComponentPage } from '../../shared/react/explorer/ComponentPage';
import { IconBrowser } from '../../shared/react/explorer/IconBrowser';


export function App() {
  const { mode, resolved } = useTheme();
  const route = useRoute();
  const active = route.kind === 'component' ? route.tag : route.kind === 'icons' ? `icons-${route.family}` : 'catalogue';
  const [iconSet, setIconSet] = useState<IconLibrary>(getIconLibrary());
  const toggleIcons = () => {
    const next: IconLibrary = iconSet === 'kvui' ? 'material' : 'kvui';
    setIconLibrary(next);
    setIconSet(next);
  };
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState('');
  const [volume, setVolume] = useState(40);
  const [submitted, setSubmitted] = useState<Record<string, string> | null>(null);
  const [alertOpen, setAlertOpen] = useState(true);

  const emailError = email && !email.includes('@') ? 'Enter an email address like name@example.com.' : undefined;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Kvui form controls take part in native FormData.
    setSubmitted(Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>);
    setSaving(true);
    setTimeout(() => setSaving(false), 900);
  };

  return (
    <>
      <a className="kvui-skip-link" href="#main">Skip to content</a>

      {/* App shell from @kvui/css: header, sidebar (md+), main. On phones everything stacks. */}
      <div className="kvui-shell kvui-shell-sidebar kvui-shell-sticky-side">
        <header className="kvui-shell__header kvui-sticky-top kvui-z-20 kvui-bg-surface kvui-border-b">
          <div className="kvui-cluster kvui-cluster-between kvui-px-4 kvui-py-3">
            <strong>Kvui UI playground</strong>
            <div className="kvui-cluster">
              <span className="kvui-small kvui-text-muted kvui-hide-below-sm">
                {mode} ({resolved})
              </span>
              <button type="button" className="kvui-btn kvui-btn-ghost kvui-btn-sm" onClick={toggleIcons} aria-label={`Icon set: ${iconSet}. Switch icon set.`}>
                Icons: {iconSet === 'kvui' ? 'Kvui' : 'Material'}
              </button>
              <UiThemeToggle />
            </div>
          </div>
        </header>

        <nav className="kvui-shell__sidebar kvui-hide-below-md kvui-p-4 kvui-border-e" aria-label="Sections">
          <Explorer active={active} />
        </nav>

        <main className="kvui-shell__main kvui-p-4 kvui-md-p-6" id="main">
          <details className="kvui-hide-md-up kvui-mb-6">
            <summary>Components and icons</summary>
            <div className="kvui-pt-2"><Explorer active={active} /></div>
          </details>

          {route.kind === 'catalogue' && (
            <>
          <div className="kvui-container-lg kvui-stack kvui-stack-xl kvui-ps-0 kvui-pe-0">
            {alertOpen && (
              <UiAlert tone="info" heading="Layout classes wired in" dismissible onUiDismiss={() => setAlertOpen(false)}>
                This page is laid out with @kvui/css (shell, container, stack, cluster, grid-auto) around the web components.
              </UiAlert>
            )}

            <section className="kvui-stack kvui-stack-lg" id="forms">
              <h2 className="kvui-h3">Forms</h2>
              <UiCard variant="raised" className="kvui-max-w-3xl">
                <span slot="header">Profile settings</span>
                <form onSubmit={onSubmit} className="kvui-stack">
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
                  <div className="kvui-cluster kvui-gap-6">
                    <UiCheckbox name="terms" required>I agree to the terms</UiCheckbox>
                    <UiSwitch name="digest" checked>Weekly digest</UiSwitch>
                  </div>
                  <div className="kvui-cluster">
                    <span className="kvui-small kvui-font-medium">Rate this form</span>
                    <UiRating label="Rate this form" value={4} />
                  </div>
                  <div className="kvui-cluster">
                    <UiButton type="submit" loading={saving}>Save changes</UiButton>
                    <UiButton type="reset" variant="ghost">Reset</UiButton>
                  </div>
                </form>
                <div slot="footer" className="kvui-text-xs kvui-font-mono kvui-break-words">
                  {submitted ? JSON.stringify(submitted) : 'Submit to see the FormData.'}
                </div>
              </UiCard>
            </section>

            <section className="kvui-stack kvui-stack-lg" id="display">
              <h2 className="kvui-h3">Display</h2>
              <div className="kvui-cluster kvui-gap-4">
                <UiAvatar name="Ada Lovelace" />
                <UiAvatar name="Grace Hopper" shape="square" />
                <UiAvatar src="/missing.png" name="Linus T" />
                <UiBadge tone="success" dot>Active</UiBadge>
                <UiBadge tone="warning" variant="outline">Pending</UiBadge>
                <UiBadge tone="danger" variant="solid">Failed</UiBadge>
                <UiSpinner label="Syncing" />
              </div>
              <div className="kvui-stack kvui-max-w-xl">
                <UiProgress label="Upload" value={64} showValue />
                <UiProgress label="Processing" />
                <div aria-busy="true" className="kvui-d-flex kvui-items-center kvui-gap-4">
                  <UiSkeleton shape="circle" width="3rem" className="kvui-shrink-0" />
                  <div className="kvui-grow"><UiSkeleton lines={2} /></div>
                </div>
              </div>
              <UiStagger step={70}>
                <p><UiCounter value={12840} locale="en-US" /> components rendered.</p>
                <p><UiCounter value={99.9} decimals={1} suffixText="%" /> uptime.</p>
              </UiStagger>
            </section>

            <FeaturesDemo />
            <ChartsDemo />
            <NewFeaturesDemo />
            <BlocksDemo />
            <LayoutDemo />
            <EditorDemo />
            <DataDemo />
            <NavDemo />
            <OverlayDemo />

            <section className="kvui-section-lg">
              <UiReveal animation="fade">
                <p>This block appears when you scroll to it.</p>
              </UiReveal>
            </section>
          </div>
            <section className="kvui-stack kvui-stack-sm" id="source">
              <h2 className="kvui-h3">Source code</h2>
              <p className="kvui-caption">Every demo is plain React and @kvui/react. Open a file to read it, copy it, or wrap long lines.</p>
              <SourceFile title="App.tsx" code={appSrc} />
              <SourceFile title="NewFeaturesDemo.tsx" code={newFeaturesSrc} />
              <SourceFile title="FeaturesDemo.tsx" code={featuresSrc} />
              <SourceFile title="ChartsDemo.tsx" code={chartsSrc} />
              <SourceFile title="DataDemo.tsx" code={dataSrc} />
              <SourceFile title="NavDemo.tsx" code={navSrc} />
              <SourceFile title="OverlayDemo.tsx" code={overlaySrc} />
              <SourceFile title="EditorDemo.tsx" code={editorSrc} />
              <SourceFile title="LayoutDemo.tsx" code={layoutSrc} />
              <SourceFile title="BlocksDemo.tsx" code={blocksSrc} />
              <SourceFile title="playground.css" code={cssSrc} />
            </section>
            </>
          )}
          {route.kind === 'component' && <ComponentPage tag={route.tag} />}
          {route.kind === 'icons' && <IconBrowser family={route.family} />}
        </main>
      </div>
    </>
  );
}
