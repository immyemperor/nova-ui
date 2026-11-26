import type { CSSProperties } from 'react';
import { UiBadge, UiButton, UiCard, UiCounter, UiProgress, UiTable } from '@kvui/react';
import type { TableColumn } from '@kvui/react';

/**
 * @kvui/css lays out the page; the web components fill it.
 * Nothing here uses a media query: every layout reflows from the space it is given.
 */
const stats = [
  { label: 'Revenue', value: 128400, prefix: '$', delta: '+12%', tone: 'success' as const },
  { label: 'Active users', value: 8421, delta: '+4%', tone: 'info' as const },
  { label: 'Conversion', value: 3.2, decimals: 1, suffix: '%', delta: '-0.3%', tone: 'warning' as const },
  { label: 'Uptime', value: 99.98, decimals: 2, suffix: '%', delta: 'steady', tone: 'success' as const },
];

const columns: TableColumn[] = [
  { key: 'name', label: 'Project', sortable: true },
  { key: 'owner', label: 'Owner' },
  { key: 'stage', label: 'Stage' },
  { key: 'budget', label: 'Budget', align: 'end', sortable: true, format: (v) => `$${Number(v).toLocaleString()}` },
];
const rows = [
  { id: 1, name: 'Atlas redesign', owner: 'Ada', stage: 'Build', budget: 48000 },
  { id: 2, name: 'Billing migration', owner: 'Grace', stage: 'Review', budget: 72000 },
  { id: 3, name: 'Mobile app', owner: 'Linus', stage: 'Plan', budget: 120000 },
  { id: 4, name: 'Data pipeline', owner: 'Margaret', stage: 'Build', budget: 64000 },
  { id: 5, name: 'Docs portal', owner: 'Tim', stage: 'Done', budget: 18000 },
];

const plans = [
  { name: 'Free', price: '$0', perks: ['1 project', 'Community support'], featured: false },
  { name: 'Team', price: '$24', perks: ['Unlimited projects', 'Email support', 'SSO'], featured: true },
  { name: 'Enterprise', price: 'Custom', perks: ['Dedicated support', 'Audit logs', 'SLA'], featured: false },
];

export function LayoutDemo() {
  return (
    <section className="kvui-stack kvui-stack-lg" id="layout">
      <div className="kvui-stack kvui-stack-sm">
        <h2 className="kvui-h3">Layout classes with web components</h2>
        <p className="kvui-text-muted kvui-max-w-prose">
          Resize the window, or drag the corner of the dashed box. The cards, sidebar, pricing row and container-query demo
          below all reflow without a single media query.
        </p>
      </div>

      {/* 1. Auto grid: as many columns as fit, no breakpoints */}
      <div className="kvui-stack kvui-stack-sm">
        <p className="kvui-caption"><code>kvui-grid-auto kvui-grid-auto-sm</code></p>
        <div className="kvui-grid-auto kvui-grid-auto-sm">
          {stats.map((s) => (
            <UiCard key={s.label} variant="raised">
              <div className="kvui-stack kvui-stack-sm">
                <span className="kvui-caption">{s.label}</span>
                <span className="kvui-text-3xl kvui-font-bold kvui-tabular-nums">
                  <UiCounter value={s.value} prefixText={s.prefix} suffixText={s.suffix} decimals={s.decimals} locale="en-US" />
                </span>
                <div>
                  <UiBadge tone={s.tone} dot>{s.delta}</UiBadge>
                </div>
              </div>
            </UiCard>
          ))}
        </div>
      </div>

      {/* 2. Sidebar: fixed-width side + fluid content; stacks when the content would get cramped */}
      <div className="kvui-stack kvui-stack-sm">
        <p className="kvui-caption"><code>kvui-sidebar</code> with <code>--kvui-sidebar-width: 14rem</code></p>
        <div className="kvui-sidebar" style={{ '--kvui-sidebar-width': '14rem' } as CSSProperties}>
          <aside className="kvui-stack kvui-stack-sm" aria-label="Summary">
            <h3 className="kvui-h5">Portfolio</h3>
            <UiProgress label="Budget used" value={72} showValue />
            <UiProgress label="Tasks done" value={45} showValue tone="success" />
            <UiProgress label="Risk" value={18} showValue tone="warning" />
          </aside>
          <UiTable caption="Projects" columns={columns} rows={rows} paginate={false} density="compact" />
        </div>
      </div>

      {/* 3. Switcher: a row of 2-4 items that becomes a column below a threshold */}
      <div className="kvui-stack kvui-stack-sm">
        <p className="kvui-caption"><code>kvui-switcher</code> with <code>--kvui-threshold: 44rem</code></p>
        <div className="kvui-switcher" style={{ '--kvui-threshold': '44rem' } as CSSProperties}>
          {plans.map((p) => (
            <UiCard key={p.name} variant={p.featured ? 'raised' : 'outlined'}>
              <div className="kvui-stack">
                <div className="kvui-cluster kvui-cluster-between">
                  <h3 className="kvui-h5">{p.name}</h3>
                  {p.featured && <UiBadge tone="accent">Popular</UiBadge>}
                </div>
                <p>
                  <span className="kvui-text-3xl kvui-font-bold">{p.price}</span>
                  {p.price !== 'Custom' && <span className="kvui-text-muted"> /month</span>}
                </p>
                <ul className="kvui-stack kvui-stack-xs kvui-small" role="list">
                  {p.perks.map((perk) => <li key={perk}>{perk}</li>)}
                </ul>
                <div>
                  <UiButton variant={p.featured ? 'primary' : 'secondary'}>Choose {p.name}</UiButton>
                </div>
              </div>
            </UiCard>
          ))}
        </div>
      </div>

      {/* 4. Container queries: the cards respond to the box they are in, not the screen */}
      <div className="kvui-stack kvui-stack-sm">
        <p className="kvui-caption"><code>kvui-cq</code> + <code>kvui-cq-md-cols-2</code>: drag the corner</p>
        <div className="pg-resizable">
          <div className="kvui-cq">
            <div className="kvui-d-grid kvui-cols-1 kvui-cq-md-cols-2 kvui-gap-4">
              <UiCard><div className="kvui-stack kvui-stack-sm"><strong>One column when narrow</strong><span className="kvui-small kvui-text-muted">Two columns once the box is 32rem wide.</span></div></UiCard>
              <UiCard><div className="kvui-stack kvui-stack-sm"><strong>Same component, anywhere</strong><span className="kvui-small kvui-text-muted">It works in a modal, a sidebar or a full page.</span></div></UiCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
