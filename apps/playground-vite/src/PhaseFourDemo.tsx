import { UiCard, UiCarousel, UiColorPicker, UiDatePicker, UiMarquee, UiOtpInput, UiTable, UiTagInput, UiTree } from '@nova-ui/react';

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status' },
];

const rows = [
  { id: 'mira', name: 'Mira Chen', role: 'Designer', status: 'Active' },
  { id: 'dev', name: 'Dev Patel', role: 'Engineer', status: 'Reviewing' },
  { id: 'sana', name: 'Sana Okafor', role: 'Researcher', status: 'Active' },
];

const nodes = [
  { id: 'design', label: 'Design', children: [{ id: 'tokens', label: 'Tokens' }, { id: 'components', label: 'Components' }] },
  { id: 'engineering', label: 'Engineering', children: [{ id: 'web', label: 'Web platform' }, { id: 'mobile', label: 'Mobile' }] },
];

export function PhaseFourDemo() {
  return (
    <section style={{ display: 'grid', gap: '1.25rem' }}>
      <header>
        <h2 style={{ margin: 0, fontSize: '1.125rem' }}>Data and complex inputs</h2>
        <p style={{ margin: '0.35rem 0 0', color: 'var(--nova-color-fg-muted)' }}>Phase 4 component set</p>
      </header>

      <UiCard>
        <span slot="header">Team directory</span>
        <UiTable caption="Project team" columns={columns} rows={rows} selectable />
      </UiCard>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 16rem), 1fr))', gap: '1.25rem' }}>
        <UiCard>
          <span slot="header">Workspace tree</span>
          <UiTree nodes={nodes} expanded={['design']} />
        </UiCard>
        <UiCard>
          <span slot="header">Project details</span>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <UiDatePicker name="review-date" label="Review date" value="2026-11-18" />
            <UiColorPicker name="brand-color" label="Brand color" value="#0b7a6c" />
            <UiTagInput name="topics" label="Topics" value={['Design system']} options={['Accessibility', 'Components', 'Documentation', 'Tokens']} />
            <UiOtpInput label="Verification code" value="482" />
          </div>
        </UiCard>
      </div>

      <UiCard>
        <span slot="header">Carousel</span>
        <UiCarousel label="Project highlights">
          <article style={{ minHeight: '8rem', padding: '1.5rem', background: 'var(--nova-color-accent-soft)' }}><strong>01 / System</strong><p>A shared language for product interfaces.</p></article>
          <article style={{ minHeight: '8rem', padding: '1.5rem', background: 'var(--nova-color-info-soft)' }}><strong>02 / Workflow</strong><p>Useful controls with keyboard support.</p></article>
          <article style={{ minHeight: '8rem', padding: '1.5rem', background: 'var(--nova-color-warning-soft)' }}><strong>03 / Delivery</strong><p>One component layer across frameworks.</p></article>
        </UiCarousel>
      </UiCard>

      <UiMarquee speed={32}>
        <span style={{ padding: '0.5rem 1rem', border: '1px solid var(--nova-color-border)', borderRadius: '6px' }}>Accessible by default</span>
        <span style={{ padding: '0.5rem 1rem', border: '1px solid var(--nova-color-border)', borderRadius: '6px' }}>Built with web components</span>
        <span style={{ padding: '0.5rem 1rem', border: '1px solid var(--nova-color-border)', borderRadius: '6px' }}>Typed framework bindings</span>
      </UiMarquee>
    </section>
  );
}