import { useMemo, useState } from 'react';
import type { CSSProperties, ChangeEvent } from 'react';
import { withViewTransition } from '@kvui/core';
import {
  UiButton, UiCard, UiCollapse, UiIcon, UiKanban, UiScheduler, UiScrollProgress, UiSortable, UiSplit, UiTable, UiVirtualList,
  generateTheme, registerIcons, resetMessages, setMessages, themeToCSS, toast,
} from '@kvui/react';

/* ---------- Split panes ---------- */
function SplitPanel() {
  return (
    <UiSplit ratio={0.3} minA={160} minB={240} storageKey="pg-split" label="Resize file list" style={{ height: 220, border: '1px solid var(--kvui-color-border)', borderRadius: 12 }}>
      <div slot="a" className="kvui-p-3 kvui-stack kvui-stack-xs">
        <strong className="kvui-small">Files</strong>
        {['README.md', 'index.ts', 'styles.css'].map((f) => <span key={f} className="kvui-small kvui-text-muted">{f}</span>)}
      </div>
      <div slot="b" className="kvui-p-4">
        <p className="kvui-small">Drag the divider, or focus it and use the arrow keys. Double-click resets. The position is remembered.</p>
      </div>
    </UiSplit>
  );
}

/* ---------- Virtual rows ---------- */
function VirtualDemo() {
  const rows = useMemo(() => Array.from({ length: 2000 }, (_, i) => ({ id: i + 1, name: `Account ${i + 1}`, balance: ((i * 7919) % 90000) + 1000, tier: ['Gold', 'Silver', 'Bronze'][i % 3] })), []);
  const columns = [
    { key: 'name', label: 'Account', sortable: true },
    { key: 'tier', label: 'Tier', sortable: true },
    { key: 'balance', label: 'Balance', align: 'end' as const, sortable: true, format: (v: unknown) => `$${Number(v).toLocaleString()}` },
  ];
  return (
    <div className="kvui-stack kvui-stack-sm">
      <p className="kvui-caption">2,000 rows, only the visible ones are in the DOM. Resize columns, sort, and export.</p>
      <UiTable virtual maxHeight="320px" rowHeight={44} paginate={false} searchable exportable resizable caption="Accounts" columns={columns} rows={rows} />
      <p className="kvui-caption">Plain virtual list (10,000 items):</p>
      <UiVirtualList count={10000} rowHeight={36} height={200} label="Ten thousand items" renderRow={(i: number) => <span>Item {i + 1}</span>} />
    </div>
  );
}

/* ---------- Expandable rows ---------- */
function ExpandableTable() {
  const rows = [
    { id: 'a', name: 'Atlas redesign', owner: 'Ada', budget: 48000 },
    { id: 'b', name: 'Billing migration', owner: 'Grace', budget: 72000 },
  ];
  return (
    <UiTable caption="Projects" expandable columns={[{ key: 'name', label: 'Project' }, { key: 'owner', label: 'Owner' }, { key: 'budget', label: 'Budget', align: 'end' as const }]} rows={rows}>
      <div slot="expand:a" className="kvui-small">Milestones: design sign-off (done), build (in progress), launch (March).</div>
      <div slot="expand:b" className="kvui-small">Risk: legacy data export. Owner: Grace. Review every Friday.</div>
    </UiTable>
  );
}

/* ---------- Sortable and kanban ---------- */
function SortableDemo() {
  const [items, setItems] = useState([{ id: 'a', label: 'Write spec' }, { id: 'b', label: 'Design review' }, { id: 'c', label: 'Build' }, { id: 'd', label: 'Ship' }]);
  return (
    <div className="kvui-stack kvui-stack-sm">
      <p className="kvui-caption">Drag, or focus an item and press Alt with the arrow keys.</p>
      <UiSortable items={items} label="Launch steps" onUiReorder={(e: CustomEvent<{ id: string; label: string }[]>) => setItems(e.detail)} />
    </div>
  );
}

function KanbanDemo() {
  const columns = [{ id: 'todo', title: 'To do' }, { id: 'doing', title: 'In progress' }, { id: 'done', title: 'Done' }];
  const cards = [
    { id: '1', title: 'Pricing page copy', detail: 'Marketing' },
    { id: '2', title: 'Payment webhooks', detail: 'Engineering' },
    { id: '3', title: 'Onboarding emails', detail: 'Lifecycle' },
  ];
  const [layout, setLayout] = useState<Record<string, string[]>>({ todo: ['1', '2'], doing: ['3'], done: [] });
  return (
    <div className="kvui-stack kvui-stack-sm">
      <p className="kvui-caption">Drag cards between columns, or focus a card and press Alt with an arrow key to move it.</p>
      <UiKanban label="Launch board" columns={columns} cards={cards} layout={layout} onUiMove={(e: CustomEvent<{ layout: Record<string, string[]> }>) => setLayout(e.detail.layout)} />
    </div>
  );
}

/* ---------- Scheduler ---------- */
function SchedulerDemo() {
  const events = [
    { id: 'e1', title: 'Design review', start: '2026-11-16', startTime: '10:00', endTime: '11:00', color: 'var(--kvui-color-accent-soft)' },
    { id: 'e2', title: 'Customer call', start: '2026-11-16', startTime: '10:30', endTime: '11:30' },
    { id: 'e3', title: 'Conference', start: '2026-11-18', end: '2026-11-20' },
  ];
  const [view, setView] = useState<'month' | 'week'>('week');
  return (
    <UiScheduler label="Team schedule" events={events} view={view} date="2026-11-16" dayStart={8} dayEnd={18}
      onUiViewChange={(e: CustomEvent<'month' | 'week'>) => setView(e.detail)}
      onUiEventClick={(e: CustomEvent<{ title: string }>) => toast.info(e.detail.title)} />
  );
}

/* ---------- Collapse ---------- */
function CollapseDemo() {
  return (
    <div className="kvui-stack kvui-stack-xs">
      <UiCollapse peek="Shipping, returns and exchanges">
        <span slot="label">Delivery</span>
        Full delivery details appear here. The height animates smoothly.
      </UiCollapse>
      <UiCollapse>
        <span slot="label">Payment methods</span>
        Card, bank transfer and invoice.
      </UiCollapse>
    </div>
  );
}

/* ---------- Brand palette from one colour ---------- */
function BrandDemo() {
  const [brand, setBrand] = useState('#7c3aed');
  const theme = useMemo(() => generateTheme(brand), [brand]);
  return (
    <div className="kvui-stack kvui-stack-sm">
      <style>{themeToCSS(theme)}</style>
      <div className="kvui-cluster">
        <label className="kvui-small">Brand colour{' '}
          <input type="color" value={brand} onChange={(e: ChangeEvent<HTMLInputElement>) => setBrand(e.target.value)} aria-label="Brand colour" />
        </label>
        <UiButton>Primary action</UiButton>
        <UiButton variant="secondary">Secondary</UiButton>
      </div>
      <p className="kvui-caption">
        {theme.warnings.length ? `Warnings: ${theme.warnings.join('; ')}` : 'Every text and accent pair meets WCAG AA in both themes.'} Changes the whole page.
      </p>
    </div>
  );
}

/* ---------- Icons ---------- */
registerIcons({ 'pg-spark': '<path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.4L12 17l-6.3 4.4L8 14l-6-4.6h7.6z"/>' });
function IconsDemo() {
  const names = ['check', 'search', 'bell', 'calendar', 'download', 'settings', 'user', 'star', 'pg-spark', 'alert-triangle'];
  return (
    <div className="kvui-cluster kvui-gap-4" aria-label="Icon examples">
      {names.map((n) => <span key={n} className="kvui-cluster kvui-gap-1 kvui-caption"><UiIcon name={n} label={n} size="1.5rem" />{n}</span>)}
    </div>
  );
}

/* ---------- i18n and view transitions ---------- */
function I18nDemo() {
  const [french, setFrench] = useState(false);
  const [page, setPage] = useState('A');
  return (
    <div className="kvui-stack kvui-stack-sm">
      <div className="kvui-cluster">
        <UiButton variant="secondary" onClick={() => { if (french) { resetMessages(); } else { setMessages({ close: 'Fermer', dismiss: 'Ignorer', noResults: 'Aucun résultat' }); } setFrench((f) => !f); }}>
          {french ? 'Back to English' : 'Show in French'}
        </UiButton>
        <UiButton variant="secondary" onClick={() => withViewTransition(() => setPage((p) => (p === 'A' ? 'B' : 'A')))}>
          Switch page (view transition)
        </UiButton>
      </div>
      <UiCard style={{ viewTransitionName: 'pg-card' } as CSSProperties}>
        <p className="kvui-small">Page {page}. Labels inside components follow the language you choose.</p>
      </UiCard>
    </div>
  );
}

export function NewFeaturesDemo() {
  return (
    <section className="kvui-stack kvui-stack-lg" id="new-features">
      <UiScrollProgress label="Reading progress" />
      <h2 className="kvui-h3">Newest features</h2>

      <div className="kvui-stack kvui-stack-sm"><h3 className="kvui-h5">Split panes</h3><SplitPanel /></div>
      <div className="kvui-stack kvui-stack-sm"><h3 className="kvui-h5">Virtual rows and export</h3><VirtualDemo /></div>
      <div className="kvui-stack kvui-stack-sm"><h3 className="kvui-h5">Expandable rows</h3><ExpandableTable /></div>
      <div className="kvui-grid-auto kvui-grid-auto-md kvui-gap-6">
        <div className="kvui-stack kvui-stack-sm"><h3 className="kvui-h5">Sortable list</h3><SortableDemo /></div>
        <div className="kvui-stack kvui-stack-sm"><h3 className="kvui-h5">Collapse</h3><CollapseDemo /></div>
      </div>
      <div className="kvui-stack kvui-stack-sm"><h3 className="kvui-h5">Kanban board</h3><KanbanDemo /></div>
      <div className="kvui-stack kvui-stack-sm"><h3 className="kvui-h5">Scheduler</h3><SchedulerDemo /></div>
      <div className="kvui-stack kvui-stack-sm"><h3 className="kvui-h5">Brand palette from one colour</h3><BrandDemo /></div>
      <div className="kvui-stack kvui-stack-sm"><h3 className="kvui-h5">Icons</h3><IconsDemo /></div>
      <div className="kvui-stack kvui-stack-sm"><h3 className="kvui-h5">Translation and transitions</h3><I18nDemo /></div>
    </section>
  );
}
