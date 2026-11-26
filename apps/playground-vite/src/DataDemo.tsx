import { useEffect, useMemo, useState } from 'react';
import {
  UiBadge, UiButton, UiCarousel, UiCard, UiColorPicker, UiDatePicker, UiMarquee, UiOtpInput, UiTable,
  UiTagInput, UiTree, toast,
} from '@kvui/react';
import type { TableColumn, TableQuery, TableRow, TreeNode } from '@kvui/react';

const roles = ['Engineer', 'Designer', 'Manager', 'Analyst'];
const statuses = ['active', 'pending', 'archived'] as const;
const tone = { active: 'success', pending: 'warning', archived: 'neutral' } as const;

const people: TableRow[] = Array.from({ length: 87 }, (_, i) => ({
  id: `u${i + 1}`,
  name: ['Ada', 'Grace', 'Linus', 'Margaret', 'Tim', 'Barbara', 'Dennis', 'Ken'][i % 8] + ` ${String.fromCharCode(65 + (i % 26))}.`,
  role: roles[i % roles.length],
  status: statuses[i % 3],
  salary: 60000 + ((i * 7919) % 70000),
  joined: new Date(2019 + (i % 6), (i * 5) % 12, 1 + (i % 27)),
}));

const columns: TableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'salary', label: 'Salary', sortable: true, align: 'end', format: (v) => `$${Number(v).toLocaleString()}` },
  { key: 'joined', label: 'Joined', sortable: true, format: (v) => (v as Date).toLocaleDateString() },
];

/** Pretend server: filters, sorts and slices, then answers after a short delay. */
function useFakeServer(query: TableQuery) {
  const [state, setState] = useState<{ rows: TableRow[]; total: number; loading: boolean }>({ rows: [], total: 0, loading: true });
  useEffect(() => {
    setState((s) => ({ ...s, loading: true }));
    const t = setTimeout(() => {
      let data = people.filter((r) => String(r.name).toLowerCase().includes(query.search.toLowerCase()));
      if (query.sort) {
        const { key, dir } = query.sort;
        data = [...data].sort((a, b) => (String(a[key]) > String(b[key]) ? 1 : -1) * (dir === 'asc' ? 1 : -1));
      }
      const start = (query.page - 1) * query.pageSize;
      setState({ rows: data.slice(start, start + query.pageSize), total: data.length, loading: false });
    }, 400);
    return () => clearTimeout(t);
  }, [query]);
  return state;
}

const tree: TreeNode[] = [
  { id: 'src', label: 'src', icon: 'menu', children: [
    { id: 'components', label: 'components', children: [{ id: 'button', label: 'ui-button.tsx' }, { id: 'table', label: 'ui-table.tsx' }] },
    { id: 'utils', label: 'utils', children: [{ id: 'theme', label: 'theme.ts' }] },
    { id: 'index', label: 'index.ts' },
  ] },
  { id: 'readme', label: 'README.md' },
];

export function DataDemo() {
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState<TableQuery>({ page: 1, pageSize: 5, search: '' });
  const server = useFakeServer(query);
  const logos = useMemo(() => ['Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli', 'Stark'], []);

  return (
    <section className="kvui-stack kvui-stack-lg" id="data">
      <h2 className="kvui-h3">Data</h2>

      <div className="kvui-stack kvui-stack-sm">
        <strong>Table: all rows in the browser</strong>
        <UiTable
          caption="Team members"
          columns={columns}
          rows={people}
          searchable
          searchPlaceholder="Search people"
          selectable
          selected={selected}
          pageSize={5}
          rowClickable
          onUiSelectionChange={(e) => setSelected(e.detail)}
          onUiRowClick={(e) => toast.info(`Opened ${e.detail.name}`)}
        >
          {people.map((p) => (
            <UiBadge key={String(p.id)} slot={`cell:${p.id}:status`} tone={tone[p.status as keyof typeof tone]} dot>
              {String(p.status)}
            </UiBadge>
          ))}
          <UiButton slot="bulk-actions" size="sm" variant="danger" onClick={() => toast.error(`Deleted ${selected.length} rows`)}>
            Delete selected
          </UiButton>
        </UiTable>
      </div>

      <div className="kvui-stack kvui-stack-sm">
        <strong>Table: server-side (manual) with loading state</strong>
        <UiTable
          manual
          caption="Server-paged people"
          columns={columns}
          rows={server.rows}
          total={server.total}
          page={query.page}
          pageSize={query.pageSize}
          pageSizeOptions={[5, 10, 20]}
          sort={query.sort}
          loading={server.loading}
          searchable
          density="compact"
          striped
          onUiQueryChange={(e) => setQuery(e.detail)}
        />
      </div>

      <div className="kvui-grid-auto kvui-grid-auto-md kvui-gap-6">
        <UiCard>
          <span slot="header">Tree</span>
          <UiTree label="Project files" nodes={tree} expanded={['src']} onUiSelect={(e) => toast(`Selected ${e.detail.node.label}`)} />
        </UiCard>
        <UiCard>
          <span slot="header">Inputs</span>
          <div className="kvui-stack">
            <UiOtpInput label="Verification code" length={6} onUiComplete={(e) => toast.success(`Code ${e.detail}`)} />
            <UiTagInput
              label="Invite by email"
              placeholder="name@example.com"
              value={['ada@example.com']}
              validate={(t) => /^\S+@\S+\.\S+$/.test(t) || 'Enter a valid email.'}
            />
            <UiDatePicker label="Start date" min="2026-01-01" max="2027-12-31" clearable />
            <UiColorPicker label="Brand colour" value="#0b7a6c" />
          </div>
        </UiCard>
      </div>

      <UiCarousel label="Highlights" slidesPerView={2} autoplay={5000}>
        {['One', 'Two', 'Three', 'Four', 'Five'].map((n, i) => (
          <div key={n} className="kvui-d-grid kvui-place-center kvui-rounded-lg kvui-font-semibold" style={{ height: 120, background: `color-mix(in srgb, var(--kvui-color-accent) ${15 + i * 12}%, var(--kvui-color-surface))` }}>
            Slide {n}
          </div>
        ))}
      </UiCarousel>

      <UiMarquee speed={40}>
        {logos.map((l) => (
          <span key={l} className="kvui-font-bold kvui-text-xl kvui-text-muted">{l}</span>
        ))}
      </UiMarquee>
    </section>
  );
}
