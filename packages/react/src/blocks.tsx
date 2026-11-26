import type { ReactNode } from 'react';
import { UiAlert, UiBadge, UiButton, UiCard, UiCheckbox, UiChart, UiIcon, UiInput, UiSidebar, UiSidebarItem, UiStep, UiStepper, UiTable } from './index';
import type { TableColumn, TableRow } from './index';

/**
 * Ready-made page compositions built from Kvui components and @kvui/css layout classes.
 * Copy one into your app and change the content; each block is a starting point, not a framework.
 */

export interface AuthBlockProps {
  title?: string;
  subtitle?: string;
  onSubmit?: (email: string, password: string) => void;
  footer?: ReactNode;
}

/** Sign-in card: email, password, remember-me and a submit button. */
export function LoginBlock({ title = 'Sign in', subtitle = 'Welcome back. Enter your details to continue.', onSubmit, footer }: AuthBlockProps) {
  return (
    <div className="kvui-container-sm kvui-section-sm">
      <UiCard variant="raised">
        <form
          className="kvui-stack"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            onSubmit?.(String(f.get('email') ?? ''), String(f.get('password') ?? ''));
          }}
        >
          <div className="kvui-stack kvui-stack-xs">
            <h2 className="kvui-h3">{title}</h2>
            <p className="kvui-text-muted kvui-small">{subtitle}</p>
          </div>
          <UiInput name="email" type="email" label="Email" required autocomplete="email" />
          <UiInput name="password" type="password" label="Password" required autocomplete="current-password" />
          <div className="kvui-cluster kvui-cluster-between">
            <UiCheckbox name="remember">Remember me</UiCheckbox>
            <a className="kvui-small" href="#forgot">Forgot password?</a>
          </div>
          <UiButton type="submit">Sign in</UiButton>
          {footer}
        </form>
      </UiCard>
    </div>
  );
}

export interface SettingsItem { id: string; label: string; description?: string; icon?: string }

/** Settings page: a sidebar of sections and a content area of switches and fields. */
export function SettingsBlock({ sections, active, children }: { sections: SettingsItem[]; active: string; children: ReactNode }) {
  return (
    <div className="kvui-shell kvui-shell-sidebar">
      <aside className="kvui-shell__sidebar kvui-p-4 kvui-border-e">
        <UiSidebar label="Settings sections">
          {sections.map((s) => <UiSidebarItem key={s.id} label={s.label} icon={s.icon} href={`#${s.id}`} current={s.id === active} />)}
        </UiSidebar>
      </aside>
      <main className="kvui-shell__main kvui-p-6">
        <div className="kvui-container-md kvui-stack kvui-stack-lg">{children}</div>
      </main>
    </div>
  );
}

export interface PricingTier { name: string; price: string; period?: string; features: string[]; featured?: boolean; cta?: string }

/** Three-column pricing that stacks on phones. */
export function PricingBlock({ tiers }: { tiers: PricingTier[] }) {
  return (
    <div className="kvui-container kvui-section kvui-stack kvui-stack-lg">
      <div className="kvui-stack kvui-stack-xs kvui-text-center">
        <p className="kvui-eyebrow">Pricing</p>
        <h2 className="kvui-h2">Pick the plan that fits</h2>
      </div>
      <div className="kvui-switcher" style={{ ['--kvui-threshold' as string]: '52rem' }}>
        {tiers.map((t) => (
          <UiCard key={t.name} variant={t.featured ? 'raised' : 'outlined'}>
            <div className="kvui-stack">
              <div className="kvui-cluster kvui-cluster-between">
                <h3 className="kvui-h5">{t.name}</h3>
                {t.featured && <UiBadge tone="accent">Popular</UiBadge>}
              </div>
              <p><span className="kvui-text-4xl kvui-font-bold">{t.price}</span>{t.period && <span className="kvui-text-muted"> {t.period}</span>}</p>
              <ul className="kvui-stack kvui-stack-xs kvui-small" role="list">
                {t.features.map((f) => <li key={f} className="kvui-cluster"><UiIcon name="check" /> {f}</li>)}
              </ul>
              <UiButton variant={t.featured ? 'primary' : 'secondary'}>{t.cta ?? `Choose ${t.name}`}</UiButton>
            </div>
          </UiCard>
        ))}
      </div>
    </div>
  );
}

export interface KpiItem { label: string; value: string; delta?: string; tone?: 'success' | 'danger' | 'info' | 'warning' }

/** Dashboard: KPI cards, a trend chart, a table of recent items and a notice. */
export function DashboardBlock({
  title,
  kpis,
  months,
  series,
  columns,
  rows,
  notice,
}: {
  title: string;
  kpis: KpiItem[];
  months: string[];
  series: { name: string; values: number[] }[];
  columns: TableColumn[];
  rows: TableRow[];
  notice?: string;
}) {
  return (
    <div className="kvui-container kvui-section kvui-stack kvui-stack-lg">
      <div className="kvui-cluster kvui-cluster-between">
        <h1 className="kvui-h2">{title}</h1>
        <UiButton variant="secondary">
          <UiIcon slot="start" name="download" />
          Export
        </UiButton>
      </div>
      {notice && <UiAlert tone="info">{notice}</UiAlert>}
      <div className="kvui-grid-auto kvui-grid-auto-sm kvui-gap-4">
        {kpis.map((k) => (
          <UiCard key={k.label}>
            <div className="kvui-stack kvui-stack-xs">
              <span className="kvui-caption">{k.label}</span>
              <span className="kvui-text-3xl kvui-font-bold kvui-tabular-nums">{k.value}</span>
              {k.delta && <UiBadge tone={k.tone ?? 'success'}>{k.delta}</UiBadge>}
            </div>
          </UiCard>
        ))}
      </div>
      <UiCard>
        <UiChart type="area" label={`${title} trend`} labels={months} series={series} />
      </UiCard>
      <UiTable caption="Recent activity" columns={columns} rows={rows} paginate density="compact" searchable exportable />
    </div>
  );
}

/** Multi-step onboarding with a stepper and tabs for plan choice. */
export function OnboardingBlock({ step, steps, children }: { step: number; steps: { heading: string; description?: string }[]; children: ReactNode }) {
  return (
    <div className="kvui-container-md kvui-section kvui-stack kvui-stack-lg">
      <UiStepper current={step} label="Onboarding progress">
        {steps.map((s) => <UiStep key={s.heading} heading={s.heading} description={s.description} />)}
      </UiStepper>
      <UiCard variant="raised"><div className="kvui-stack">{children}</div></UiCard>
    </div>
  );
}
