import { UiChart, UiSparkline, UiTable } from '@omni/react';
import type { TableColumn, TableRow } from '@omni/react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
const revenue = [12, 18, 15, 22, 27, 25, 31, 38];
const signups = [40, 52, 48, 66, 71, 64, 80, 92];

const regions = [
  { label: 'North', value: 420 },
  { label: 'South', value: 260 },
  { label: 'East', value: 180 },
  { label: 'West', value: 90 },
];

const columns: TableColumn[] = [
  { key: 'name', label: 'Campaign', sortable: true },
  { key: 'spend', label: 'Spend', align: 'end', sortable: true, format: (v) => `$${Number(v).toLocaleString()}` },
  { key: 'trend', label: 'Last 8 weeks' },
];
const rows: TableRow[] = [
  { id: 1, name: 'Spring launch', spend: 4200, trend: [3, 5, 4, 7, 6, 8, 9, 11] },
  { id: 2, name: 'Referral bonus', spend: 1800, trend: [2, 2, 3, 2, 4, 3, 5, 4] },
  { id: 3, name: 'Podcast sponsor', spend: 900, trend: [8, 7, 7, 6, 5, 5, 4, 3] },
];

export function ChartsDemo() {
  return (
    <section className="nova-stack nova-stack-lg" id="charts">
      <h2 className="nova-h3">Charts and export</h2>

      <div className="nova-grid-auto nova-grid-auto-lg nova-gap-6">
        <div className="nova-stack nova-stack-sm">
          <h3 className="nova-h5">Revenue (area)</h3>
          <UiChart type="area" label="Monthly revenue in thousands" labels={months} series={[{ name: 'Revenue', values: revenue }]} />
        </div>
        <div className="nova-stack nova-stack-sm">
          <h3 className="nova-h5">Signups (line, two series)</h3>
          <UiChart type="line" label="Signups by month" labels={months} series={[
            { name: 'Signups', values: signups },
            { name: 'Target', values: months.map(() => 60), color: 'var(--nova-color-fg-muted)' },
          ]} />
        </div>
        <div className="nova-stack nova-stack-sm">
          <h3 className="nova-h5">Revenue (bars)</h3>
          <UiChart type="bar" label="Monthly revenue in thousands, bars" labels={months} series={[{ name: 'Revenue', values: revenue }]} />
        </div>
        <div className="nova-stack nova-stack-sm">
          <h3 className="nova-h5">Share by region (donut)</h3>
          <UiChart type="donut" label="Orders by region" labels={regions.map((r) => r.label)} series={[{ name: 'Orders', values: regions.map((r) => r.value) }]} />
        </div>
      </div>

      <div className="nova-stack nova-stack-sm">
        <h3 className="nova-h5">Sparklines in a table</h3>
        <UiTable
          exportable
          exportFilename="campaigns"
          caption="Campaigns"
          columns={columns}
          rows={rows}
          paginate={false}
          density="compact"
          onUiQueryChange={() => undefined}
        >
          {rows.map((r) => (
            <UiSparkline key={String(r.id)} slot={`cell:${r.id}:trend`} values={r.trend as number[]} area label={`${r.name} trend`} />
          ))}
        </UiTable>
        <div className="nova-cluster">
          <UiSparkline values={revenue} label="Revenue trend" area />
          <span className="nova-small nova-text-muted">Inline trend next to text.</span>
        </div>
      </div>
    </section>
  );
}
