import { useEffect, useMemo, useState } from 'react';
import { SourceFile } from '../../shared/react/CodeBlock';
import { ExplorerLayout } from '../../shared/react/explorer/ExplorerLayout';
import { useRoute } from '../../shared/react/explorer/route';
import appSrc from './App.tsx?raw';
import apiSrc from './api.ts?raw';
import type { FormEvent } from 'react';
import {
  UiAlert, UiBadge, UiButton, UiCard, UiChart, UiDateRangePicker, UiField, UiIcon, UiInput, UiModal, UiSelect, UiSidebar,
  UiSidebarItem, UiTable, UiTabs, UiTab, UiTabPanel, UiThemeToggle, UiToaster, confirm, prompt, toast,
} from '@kvui/react';
import type { DateRange, IconLibrary, TableColumn } from '@kvui/react';
import { getIconLibrary, setIconLibrary } from '@kvui/react';
import { fetchInvoices } from './api';
import type { Invoice, Query } from './api';

/* ---------- Server-paged table with search, sort and bulk actions ---------- */
const columns: TableColumn[] = [
  { key: 'id', label: 'Invoice', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'issued', label: 'Issued', sortable: true },
  { key: 'amount', label: 'Amount', align: 'end', sortable: true, format: (v) => `$${Number(v).toLocaleString()}` },
  { key: 'status', label: 'Status' },
];
const tone = { paid: 'success', due: 'warning', overdue: 'danger' } as const;

function InvoiceTable() {
  const [query, setQuery] = useState<Query>({ page: 1, pageSize: 10, search: '' });
  const [rows, setRows] = useState<Invoice[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    let live = true;
    setLoading(true);
    fetchInvoices(query).then((res) => {
      if (!live) return;
      setRows(res.rows);
      setTotal(res.total);
      setLoading(false);
    });
    return () => { live = false; };
  }, [query]);

  const bulkDelete = async () => {
    const ok = await confirm({ title: `Delete ${selected.length} invoices?`, message: 'They cannot be recovered.', confirmLabel: 'Delete', danger: true });
    if (ok) { toast.success(`Deleted ${selected.length}`); setSelected([]); }
  };

  const displayRows = useMemo(() => rows.map((r) => ({ ...r, status: <UiBadge tone={tone[r.status]}>{r.status}</UiBadge> })), [rows]);

  return (
    <UiTable
      manual
      caption="Invoices"
      columns={columns}
      rows={displayRows as unknown as Record<string, unknown>[]}
      total={total}
      page={query.page}
      pageSize={query.pageSize}
      sort={query.sort}
      searchable
      selectable
      exportable
      exportFilename="invoices"
      loading={loading}
      selected={selected}
      onUiQueryChange={(e: CustomEvent<Query>) => setQuery((q) => ({ ...q, ...e.detail }))}
      onUiSelectionChange={(e: CustomEvent<string[]>) => setSelected(e.detail)}
    >
      <UiButton slot="bulk-actions" size="sm" variant="danger" onClick={bulkDelete}>Delete selected</UiButton>
    </UiTable>
  );
}

/* ---------- Form with validation, FormData submit, and a confirmation modal ---------- */
function InviteForm() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [range, setRange] = useState<DateRange>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState<Record<string, string> | null>(null);
  const emailError = email && !/^\S+@\S+\.\S+$/.test(email) ? 'Enter an address like name@company.com.' : undefined;

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emailError || !email) return;
    setPending(Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>);
    setConfirmOpen(true);
  };

  const send = async () => {
    setConfirmOpen(false);
    toast.success(`Invitation sent to ${pending?.email}`);
  };

  const askNote = async () => {
    const note = await prompt({ title: 'Add a note', placeholder: 'Optional', validate: (v: string) => (v.length > 140 ? 'Keep it under 140 characters.' : undefined) });
    if (note) toast.info(`Note saved: ${note}`);
  };

  return (
    <UiCard variant="raised">
      <form onSubmit={submit} className="kvui-stack">
        <UiInput name="email" type="email" label="Email" required value={email} error={emailError} onUiInput={(e: CustomEvent<string>) => setEmail(e.detail)} />
        <UiSelect name="role" label="Role" value={role} options={[{ value: 'member', label: 'Member' }, { value: 'admin', label: 'Admin' }]} onUiChange={(e: CustomEvent<string | string[]>) => setRole(String(e.detail))} />
        <UiDateRangePicker name="access" label="Access period" presets value={range} onUiChange={(e: CustomEvent<DateRange>) => setRange(e.detail)} />
        <UiField label="Note" hint="Shown to the invitee">
          <UiButton variant="secondary" onClick={askNote}><UiIcon slot="start" name="pencil" /> Add a note</UiButton>
        </UiField>
        <div className="kvui-cluster kvui-cluster-end">
          <UiButton type="submit">Send invitation</UiButton>
        </div>
      </form>
      <UiModal open={confirmOpen} heading="Send invitation?" size="sm" onUiClose={() => setConfirmOpen(false)}>
        <p className="kvui-small">We will email <strong>{pending?.email}</strong> as {role}.</p>
        <div slot="footer" className="kvui-cluster kvui-cluster-end kvui-d-contents">
          <UiButton variant="ghost" onClick={() => setConfirmOpen(false)}>Cancel</UiButton>
          <UiButton onClick={send}>Send</UiButton>
        </div>
      </UiModal>
    </UiCard>
  );
}

/* ---------- Dashboard ---------- */
function Dashboard() {
  return (
    <div className="kvui-stack kvui-stack-lg">
      <div className="kvui-grid-auto kvui-grid-auto-sm kvui-gap-4">
        <UiCard><div className="kvui-stack kvui-stack-xs"><span className="kvui-caption">Collected</span><span className="kvui-text-3xl kvui-font-bold">$84,200</span><UiBadge tone="success">+12%</UiBadge></div></UiCard>
        <UiCard><div className="kvui-stack kvui-stack-xs"><span className="kvui-caption">Overdue</span><span className="kvui-text-3xl kvui-font-bold">$6,410</span><UiBadge tone="danger">+3%</UiBadge></div></UiCard>
      </div>
      <UiChart type="bar" label="Collected by month, thousands" labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']} series={[{ name: 'Collected', values: [42, 51, 47, 60, 58, 84] }]} />
    </div>
  );
}

/* ---------- Shell ---------- */
export function App() {
  const [section, setSection] = useState('dashboard');
  const route = useRoute();
  const [iconSet, setIconSet] = useState<IconLibrary>(getIconLibrary());
  const toggleIcons = () => {
    const next: IconLibrary = iconSet === 'kvui' ? 'material' : 'kvui';
    setIconLibrary(next);
    setIconSet(next);
  };
  const [banner, setBanner] = useState(true);

  if (route.kind !== 'catalogue') {
    return <ExplorerLayout route={route} appName="Billing" backHref="#/" backLabel="Back to the app" />;
  }

  return (
    <div className="kvui-shell kvui-shell-sidebar kvui-shell-sticky-side">
      <header className="kvui-shell__header kvui-bg-surface kvui-border-b kvui-sticky-top kvui-z-20">
        <div className="kvui-cluster kvui-cluster-between kvui-px-4 kvui-py-3">
          <strong>Billing</strong>
          <div className="kvui-cluster">
            <a className="kvui-btn kvui-btn-ghost kvui-btn-sm" href="#/component/ui-button">Components</a>
            <button type="button" className="kvui-btn kvui-btn-ghost kvui-btn-sm" onClick={toggleIcons}>Icons: {iconSet === 'kvui' ? 'Kvui' : 'Material'}</button>
            <UiThemeToggle />
          </div>
        </div>
      </header>

      <nav className="kvui-shell__sidebar kvui-hide-below-md kvui-p-4 kvui-border-e">
        <UiSidebar label="Main" storageKey="react-app-sidebar">
          {[['dashboard', 'Dashboard', 'home'], ['invoices', 'Invoices', 'file'], ['team', 'Team', 'users']].map(([id, label, icon]) => (
            <UiSidebarItem key={id} label={label} icon={icon} current={section === id} onUiSelect={() => setSection(id)} href={`#${id}`} />
          ))}
        </UiSidebar>
      </nav>

      <main className="kvui-shell__main kvui-p-4 kvui-md-p-6" id="main">
        <div className="kvui-container-lg kvui-stack kvui-stack-lg">
          {banner && (
            <UiAlert tone="info" heading="Sample data" dismissible onUiDismiss={() => setBanner(false)}>
              Everything here is served by a local stand-in API. Replace src/api.ts with your backend.
            </UiAlert>
          )}
          <h1 className="kvui-h2">{section === 'dashboard' ? 'Dashboard' : section === 'invoices' ? 'Invoices' : 'Team'}</h1>

          <UiTabs label="Sections" value={section} onUiChange={(e: CustomEvent<string>) => setSection(String(e.detail))}>
            <UiTab value="dashboard">Dashboard</UiTab>
            <UiTab value="invoices">Invoices</UiTab>
            <UiTab value="team">Team</UiTab>
            <UiTabPanel value="dashboard"><Dashboard /></UiTabPanel>
            <UiTabPanel value="invoices"><InvoiceTable /></UiTabPanel>
            <UiTabPanel value="team"><InviteForm /></UiTabPanel>
          </UiTabs>

          <section className="kvui-stack kvui-stack-sm" id="source">
            <h2 className="kvui-h4">Source code</h2>
            <p className="kvui-caption">Copy any file. The invoice API is in src/api.ts; replace it with your backend.</p>
            <SourceFile title="App.tsx" code={appSrc} />
            <SourceFile title="api.ts" code={apiSrc} />
          </section>
        </div>
      </main>
      <UiToaster />
    </div>
  );
}
