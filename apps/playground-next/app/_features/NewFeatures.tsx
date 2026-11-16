'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { UiButton, UiChart, UiCollapse, UiIcon, UiKanban, UiScheduler, UiSidebar, UiSidebarItem, UiSplit, UiTable, UiTimePicker, UiDateRangePicker, UiFileUpload, usePresence, toast } from '@nova-ui/react';
import type { DateRange } from '@nova-ui/react';

// The editor is large and browser-only: load it on the client, so it stays out of the server bundle.
const UiEditor = dynamic(() => import('@nova-ui/react/editor').then((m) => m.UiEditor), { ssr: false });

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export function NewFeatures() {
  const [range, setRange] = useState<DateRange>({});
  const [time, setTime] = useState('09:30');
  const [open, setOpen] = useState(true);
  const { mounted, phase } = usePresence(open, 180);
  const [html, setHtml] = useState('<p>Try the editor: type / for commands.</p>');
  const [layout, setLayout] = useState<Record<string, string[]>>({ todo: ['1'], doing: ['2'], done: ['3'] });
  const cards = [
    { id: '1', title: 'Pricing copy' },
    { id: '2', title: 'Webhooks' },
    { id: '3', title: 'Emails' },
  ];

  return (
    <div className="nova-stack nova-stack-lg">
      <section className="nova-stack nova-stack-sm">
        <h2 className="nova-h4">Sidebar and split panes</h2>
        <div className="nova-cluster nova-gap-4">
          <UiSidebar label="Demo navigation" storageKey="next-sidebar">
            <UiSidebarItem label="Overview" icon="home" current href="#" />
            <UiSidebarItem label="Reports" icon="bar-chart" group open>
              <UiSidebarItem label="Weekly" href="#" />
            </UiSidebarItem>
          </UiSidebar>
          <UiSplit ratio={0.35} minA={140} minB={220} storageKey="next-split" style={{ flex: 1, height: 180, border: '1px solid var(--nova-color-border)', borderRadius: 12 }}>
            <div slot="a" className="nova-p-3 nova-small">List pane</div>
            <div slot="b" className="nova-p-3 nova-small">Detail pane</div>
          </UiSplit>
        </div>
      </section>

      <section className="nova-stack nova-stack-sm">
        <h2 className="nova-h4">Dates and times</h2>
        <div className="nova-grid-auto nova-grid-auto-md nova-gap-4">
          <UiDateRangePicker label="Report period" presets value={range} onUiChange={(e: CustomEvent<DateRange>) => setRange(e.detail)} />
          <UiTimePicker label="Meeting time" value={time} min="08:00" max="18:00" step={15} onUiChange={(e: CustomEvent<string>) => setTime(e.detail)} />
        </div>
      </section>

      <section className="nova-stack nova-stack-sm">
        <h2 className="nova-h4">Charts and table</h2>
        <UiChart type="area" label="Revenue in thousands" labels={months} series={[{ name: 'Revenue', values: [12, 18, 15, 22, 27, 31] }]} />
        <UiTable exportable caption="Recent activity" columns={[{ key: 'event', label: 'Event', sortable: true }, { key: 'when', label: 'When' }]}
          rows={[{ id: 1, event: 'Invoice paid', when: 'Today' }, { id: 2, event: 'New signup', when: 'Yesterday' }]} paginate={false} />
      </section>

      <section className="nova-stack nova-stack-sm">
        <h2 className="nova-h4">Kanban and schedule</h2>
        <UiKanban label="Board" columns={[{ id: 'todo', title: 'To do' }, { id: 'doing', title: 'Doing' }, { id: 'done', title: 'Done' }]} cards={cards} layout={layout}
          onUiMove={(e: CustomEvent<{ layout: Record<string, string[]> }>) => setLayout(e.detail.layout)} />
        <UiScheduler label="Week" view="week" date="2026-11-16" dayStart={8} dayEnd={18}
          events={[{ id: 'a', title: 'Standup', start: '2026-11-16', startTime: '09:00', endTime: '09:15' }]}
          onUiEventClick={(e: CustomEvent<{ title: string }>) => toast.info(e.detail.title)} />
      </section>

      <section className="nova-stack nova-stack-sm">
        <h2 className="nova-h4">Collapse, upload and exit animation</h2>
        <UiCollapse peek="Shipping details">
          <span slot="label">Delivery</span>
          Full details here.
        </UiCollapse>
        <UiFileUpload label="Attachments" accept=".pdf,.png" maxSize={5 * 1024 * 1024} maxFiles={3} />
        <div className="nova-cluster">
          <UiButton variant="secondary" onClick={() => setOpen((o) => !o)}>{open ? 'Hide' : 'Show'} notice</UiButton>
          <span className="nova-caption">phase: {phase}</span>
        </div>
        {mounted && (
          <div className={phase === 'exiting' ? 'nova-fade-out' : 'nova-fade-in'} role="status">
            <UiIcon name="info" /> This notice fades out before it leaves the page.
          </div>
        )}
      </section>

      <section className="nova-stack nova-stack-sm">
        <h2 className="nova-h4">Rich text editor (client-only)</h2>
        <UiEditor label="Notes" preset="minimal" value={html} onUiChange={(e: CustomEvent<string>) => setHtml(e.detail)} />
        <UiCollapse>
          <span slot="label">Stored HTML</span>
          <code className="nova-small nova-break-words">{html}</code>
        </UiCollapse>
      </section>
    </div>
  );
}
