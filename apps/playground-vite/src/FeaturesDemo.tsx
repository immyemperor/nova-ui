import { useState } from 'react';
import {
  UiButton, UiDateRangePicker, UiField, UiFileUpload, UiHtml, UiSelect, UiSidebar, UiSidebarItem,
  UiTimePicker, confirm, prompt, toast,
} from '@nova-ui/react';
import type { DateRange } from '@nova-ui/react';

const untrusted = `<h3>Release notes</h3><p>Fixed the <strong>export</strong> bug. <a href="javascript:alert(1)">this link is removed</a>.</p><script>alert('xss')</script><img src="https://example.com/x.png" alt="chart" onerror="alert(1)"><p>Ends here.</p>`;

export function FeaturesDemo() {
  const [range, setRange] = useState<DateRange>({});
  const [time, setTime] = useState('09:30');
  const [name, setName] = useState('Untitled project');

  const askDelete = async () => {
    const ok = await confirm({ title: 'Delete project?', message: 'This removes every file in it. It cannot be undone.', confirmLabel: 'Delete', danger: true });
    toast(ok ? 'Project deleted' : 'Kept the project');
  };
  const askName = async () => {
    const v = await prompt({
      title: 'Rename project',
      defaultValue: name,
      validate: (s: string) => (s.length < 3 ? 'Use at least 3 characters.' : undefined),
    });
    if (v) setName(v);
  };

  return (
    <section className="nova-stack nova-stack-lg" id="features">
      <h2 className="nova-h3">New features</h2>

      <div className="nova-cluster">
        <UiButton variant="danger" onClick={askDelete}>Delete project…</UiButton>
        <UiButton variant="secondary" onClick={askName}>Rename “{name}”</UiButton>
      </div>

      <div className="nova-grid-auto nova-grid-auto-md nova-gap-6">
        <UiDateRangePicker label="Report period" presets value={range} onUiChange={(e) => setRange(e.detail)} />
        <UiTimePicker label="Meeting time" value={time} min="08:00" max="18:00" step={15} onUiChange={(e) => setTime(e.detail)} />
        <UiField label="Region" hint="Used for billing and tax.">
          <UiSelect options={[{ value: 'uk', label: 'United Kingdom' }, { value: 'in', label: 'India' }]} />
        </UiField>
      </div>

      <UiFileUpload
        label="Attachments"
        accept=".pdf,.png,.jpg"
        maxSize={5 * 1024 * 1024}
        maxFiles={4}
        uploadFn={(file, progress) => new Promise((resolve) => {
          let p = 0;
          const tick = setInterval(() => { p += 0.25; progress(p); if (p >= 1) { clearInterval(tick); resolve(URL.createObjectURL(file)); } }, 200);
        })}
        onUiRejected={(e) => console.warn('rejected', e.detail)}
      />

      <div className="nova-cluster nova-gap-6">
        <UiSidebar label="Demo navigation" storageKey="nova-demo-sidebar">
          <UiSidebarItem label="Overview" icon="menu" current href="#features" />
          <UiSidebarItem label="Projects" icon="check" badge="3" href="#features" />
          <UiSidebarItem label="Reports" icon="chevron-right" group open>
            <UiSidebarItem label="Weekly" href="#features" />
            <UiSidebarItem label="Monthly" href="#features" />
          </UiSidebarItem>
        </UiSidebar>
        <div className="nova-stack nova-grow">
          <p className="nova-caption">Sidebar state is remembered between visits. Try the collapse button.</p>
        </div>
      </div>

      <div className="nova-stack nova-stack-sm">
        <h3 className="nova-h5">Sanitised content</h3>
        <p className="nova-caption">Scripts, event handlers and javascript: links are removed before display.</p>
        <UiHtml html={untrusted} prose />
      </div>
    </section>
  );
}
