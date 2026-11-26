'use client';

// Live examples for the component explorer. Each block sits between "// @example <tag>" and "// @end".
// The explorer shows the imports at the top plus the block, so each block can be copied and used as it is.
import { useState } from 'react';
import type { ReactElement } from 'react';
import {
  UiAccordion, UiAccordionItem, UiAlert, UiBadge, UiButton, UiCard, UiChart, UiCheckbox, UiCollapse, UiColorPicker,
  UiCounter, UiDateRangePicker, UiDatePicker, UiDropdown, UiFileUpload, UiIcon, UiInput, UiKanban,
  UiMenuItem, UiModal, UiPagination, UiProgress, UiRadio, UiRadioGroup, UiRating, UiScheduler, UiSelect, UiSlider,
  UiSortable, UiSparkline, UiSpinner, UiSplit, UiStepper, UiStep, UiSwitch, UiTable, UiTabs, UiTab, UiTabPanel,
  UiTextarea, UiThemeToggle, UiTimePicker, UiToaster, UiTooltip, UiTree, UiVirtualList, UiAvatar, toast,
} from '@kvui/react';

// @example ui-button
function ButtonExample() {
  return (
    <div className="kvui-cluster">
      <UiButton>Save</UiButton>
      <UiButton variant="secondary">Cancel</UiButton>
      <UiButton variant="ghost">Ghost</UiButton>
      <UiButton variant="danger">Delete</UiButton>
      <UiButton loading>Saving</UiButton>
    </div>
  );
}
// @end

// @example ui-icon
function IconExample() {
  return (
    <div className="kvui-cluster">
      <UiIcon name="check" label="Done" />
      <UiIcon name="star" filled label="Starred" />
      <UiIcon name="alert-triangle" size="2rem" label="Warning" />
    </div>
  );
}
// @end

// @example ui-input
function InputExample() {
  const [email, setEmail] = useState('');
  const error = email && !email.includes('@') ? 'Enter a valid address.' : undefined;
  return <UiInput label="Email" type="email" placeholder="name@example.com" hint="We never share it." value={email} error={error} onUiInput={(e: CustomEvent<string>) => setEmail(e.detail)} />;
}
// @end

// @example ui-textarea
function TextareaExample() {
  return <UiTextarea label="Bio" maxlength={160} autoresize rows={2} />;
}
// @end

// @example ui-checkbox
function CheckboxExample() {
  return <UiCheckbox name="terms" required>I agree to the terms</UiCheckbox>;
}
// @end

// @example ui-switch
function SwitchExample() {
  return <UiSwitch checked>Weekly digest</UiSwitch>;
}
// @end

// @example ui-radio-group
function RadioExample() {
  return (
    <UiRadioGroup label="Plan" value="team">
      <UiRadio value="solo">Solo</UiRadio>
      <UiRadio value="team">Team</UiRadio>
      <UiRadio value="org" disabled>Organisation</UiRadio>
    </UiRadioGroup>
  );
}
// @end

// @example ui-slider
function SliderExample() {
  return <UiSlider label="Volume" min={0} max={100} step={5} value={40} showValue />;
}
// @end

// @example ui-rating
function RatingExample() {
  return <UiRating label="Rate this" value={4} />;
}
// @end

// @example ui-select
function SelectExample() {
  const [owner, setOwner] = useState('');
  return (
    <UiSelect
      label="Owner"
      searchable
      clearable
      value={owner}
      options={[{ value: 'ada', label: 'Ada Lovelace' }, { value: 'grace', label: 'Grace Hopper' }, { value: 'linus', label: 'Linus Torvalds' }]}
      onUiChange={(e: CustomEvent<string | string[]>) => setOwner(String(e.detail))}
    />
  );
}
// @end

// @example ui-date-picker
function DatePickerExample() {
  return <UiDatePicker label="Start date" min="2026-01-01" max="2027-12-31" clearable />;
}
// @end

// @example ui-date-range-picker
function DateRangeExample() {
  return <UiDateRangePicker label="Report period" presets />;
}
// @end

// @example ui-time-picker
function TimeExample() {
  return <UiTimePicker label="Meeting time" value="09:30" min="08:00" max="18:00" step={15} />;
}
// @end

// @example ui-color-picker
function ColourExample() {
  return <UiColorPicker label="Brand colour" value="#0b7a6c" />;
}
// @end

// @example ui-alert
function AlertExample() {
  return (
    <div className="kvui-stack kvui-stack-sm">
      <UiAlert tone="success" heading="Saved">Your changes are live.</UiAlert>
      <UiAlert tone="danger" heading="Could not save" dismissible>Check your connection and try again.</UiAlert>
    </div>
  );
}
// @end

// @example ui-badge
function BadgeExample() {
  return (
    <div className="kvui-cluster">
      <UiBadge tone="success" dot>Active</UiBadge>
      <UiBadge tone="warning" variant="outline">Pending</UiBadge>
      <UiBadge tone="danger" variant="solid">Failed</UiBadge>
    </div>
  );
}
// @end

// @example ui-avatar
function AvatarExample() {
  return (
    <div className="kvui-cluster">
      <UiAvatar name="Ada Lovelace" />
      <UiAvatar name="Grace Hopper" shape="square" size="lg" />
    </div>
  );
}
// @end

// @example ui-progress
function ProgressExample() {
  return (
    <div className="kvui-stack kvui-stack-sm">
      <UiProgress label="Upload" value={64} showValue />
      <UiProgress label="Processing" />
    </div>
  );
}
// @end

// @example ui-spinner
function SpinnerExample() {
  return <UiSpinner label="Saving" />;
}
// @end

// @example ui-counter
function CounterExample() {
  return <UiCounter value={12840} locale="en-US" />;
}
// @end

// @example ui-toaster
function ToasterExample() {
  return (
    <div className="kvui-cluster">
      <UiButton onClick={() => toast.success('Saved')}>Success toast</UiButton>
      <UiButton variant="secondary" onClick={() => toast.error({ title: 'Upload failed', description: 'Check your connection.', actionLabel: 'Retry', onAction: () => toast('Retrying') })}>Error toast</UiButton>
      <UiToaster />
    </div>
  );
}
// @end

// @example ui-modal
function ModalExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <UiButton onClick={() => setOpen(true)}>Open dialog</UiButton>
      <UiModal open={open} heading="Delete project?" size="sm" onUiClose={() => setOpen(false)}>
        This removes every file in it.
        <div slot="footer" className="kvui-cluster kvui-cluster-end kvui-d-contents">
          <UiButton variant="ghost" onClick={() => setOpen(false)}>Cancel</UiButton>
          <UiButton variant="danger" onClick={() => setOpen(false)}>Delete</UiButton>
        </div>
      </UiModal>
    </>
  );
}
// @end

// @example ui-dropdown
function DropdownExample() {
  return (
    <UiDropdown onUiSelect={(e: CustomEvent<{ label: string }>) => toast.info(e.detail.label)}>
      <UiButton slot="trigger" variant="secondary">Actions<UiIcon slot="end" name="chevron-down" /></UiButton>
      <UiMenuItem value="rename">Rename</UiMenuItem>
      <UiMenuItem value="duplicate" shortcut="Ctrl D">Duplicate</UiMenuItem>
      <UiMenuItem value="delete" tone="danger" divider>Delete</UiMenuItem>
    </UiDropdown>
  );
}
// @end

// @example ui-tooltip
function TooltipExample() {
  return (
    <UiTooltip content="Saved 2 minutes ago" placement="top">
      <UiButton variant="ghost">Hover me</UiButton>
    </UiTooltip>
  );
}
// @end

// @example ui-tabs
function TabsExample() {
  const [tab, setTab] = useState('overview');
  return (
    <UiTabs label="Project sections" value={tab} onUiChange={(e: CustomEvent<string>) => setTab(String(e.detail))}>
      <UiTab value="overview">Overview</UiTab>
      <UiTab value="activity">Activity</UiTab>
      <UiTab value="billing" disabled>Billing</UiTab>
      <UiTabPanel value="overview">Overview content.</UiTabPanel>
      <UiTabPanel value="activity">Recent activity.</UiTabPanel>
    </UiTabs>
  );
}
// @end

// @example ui-accordion
function AccordionExample() {
  return (
    <UiAccordion>
      <UiAccordionItem heading="What is Kvui UI?" open>A framework-agnostic component library.</UiAccordionItem>
      <UiAccordionItem heading="Does it work with Angular?">Yes, with generated standalone wrappers.</UiAccordionItem>
    </UiAccordion>
  );
}
// @end

// @example ui-pagination
function PaginationExample() {
  const [page, setPage] = useState(4);
  return (
    <div className="kvui-stack kvui-stack-xs">
      <UiPagination page={page} total={240} pageSize={10} onUiChange={(e: CustomEvent<number>) => setPage(e.detail)} />
      <span className="kvui-caption">Page {page} of 24</span>
    </div>
  );
}
// @end

// @example ui-stepper
function StepperExample() {
  const [step, setStep] = useState(1);
  return (
    <UiStepper current={step} clickable onUiChange={(e: CustomEvent<number>) => setStep(e.detail)}>
      <UiStep heading="Account" description="Your details" />
      <UiStep heading="Workspace" description="Name it" />
      <UiStep heading="Invite" />
    </UiStepper>
  );
}
// @end

// @example ui-table
function TableExample() {
  const rows = [
    { id: 1, name: 'Atlas redesign', owner: 'Ada', budget: 48000 },
    { id: 2, name: 'Billing migration', owner: 'Grace', budget: 72000 },
    { id: 3, name: 'Mobile app', owner: 'Linus', budget: 120000 },
  ];
  return (
    <UiTable
      caption="Projects"
      searchable
      selectable
      exportable
      columns={[
        { key: 'name', label: 'Project', sortable: true },
        { key: 'owner', label: 'Owner', sortable: true },
        { key: 'budget', label: 'Budget', align: 'end', sortable: true, format: (v: unknown) => `$${Number(v).toLocaleString()}` },
      ]}
      rows={rows}
    />
  );
}
// @end

// @example ui-tree
function TreeExample() {
  return (
    <UiTree
      label="Project files"
      expanded={['src']}
      nodes={[
        { id: 'src', label: 'src', icon: 'folder', children: [{ id: 'button', label: 'ui-button.tsx' }, { id: 'table', label: 'ui-table.tsx' }] },
        { id: 'readme', label: 'README.md', icon: 'file' },
      ]}
    />
  );
}
// @end

// @example ui-sortable
function SortableExample() {
  const [items, setItems] = useState([{ id: 'a', label: 'Write spec' }, { id: 'b', label: 'Design review' }, { id: 'c', label: 'Ship' }]);
  return <UiSortable label="Launch steps" items={items} onUiReorder={(e: CustomEvent<{ id: string; label: string }[]>) => setItems(e.detail)} />;
}
// @end

// @example ui-kanban
function KanbanExample() {
  const [layout, setLayout] = useState<Record<string, string[]>>({ todo: ['1', '2'], doing: ['3'], done: [] });
  return (
    <UiKanban
      label="Board"
      columns={[{ id: 'todo', title: 'To do' }, { id: 'doing', title: 'In progress' }, { id: 'done', title: 'Done' }]}
      cards={[{ id: '1', title: 'Pricing copy' }, { id: '2', title: 'Webhooks' }, { id: '3', title: 'Emails' }]}
      layout={layout}
      onUiMove={(e: CustomEvent<{ layout: Record<string, string[]> }>) => setLayout(e.detail.layout)}
    />
  );
}
// @end

// @example ui-scheduler
function SchedulerExample() {
  return (
    <UiScheduler
      label="Week"
      view="week"
      date="2026-11-16"
      dayStart={8}
      dayEnd={18}
      events={[
        { id: 'e1', title: 'Design review', start: '2026-11-16', startTime: '10:00', endTime: '11:00' },
        { id: 'e2', title: 'Customer call', start: '2026-11-16', startTime: '10:30', endTime: '11:30' },
      ]}
    />
  );
}
// @end

// @example ui-chart
function ChartExample() {
  return (
    <UiChart
      type="area"
      label="Revenue in thousands"
      labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
      series={[{ name: 'Revenue', values: [12, 18, 15, 22, 27, 31] }]}
    />
  );
}
// @end

// @example ui-sparkline
function SparklineExample() {
  return (
    <div className="kvui-cluster">
      <UiSparkline label="Revenue trend" values={[3, 5, 4, 7, 6, 8, 9, 11]} area />
      <span className="kvui-small kvui-text-muted">Last eight weeks</span>
    </div>
  );
}
// @end

// @example ui-card
function CardExample() {
  return (
    <UiCard variant="raised">
      <span slot="header">Profile</span>
      <p>Card body content.</p>
      <div slot="footer" className="kvui-cluster kvui-cluster-end"><UiButton size="sm">Save</UiButton></div>
    </UiCard>
  );
}
// @end

// @example ui-split
function SplitExample() {
  return (
    <UiSplit ratio={0.3} minA={160} minB={240} label="Resize file list" style={{ height: 180, border: '1px solid var(--kvui-color-border)', borderRadius: 12 }}>
      <div slot="a" className="kvui-p-3 kvui-small">List pane</div>
      <div slot="b" className="kvui-p-3 kvui-small">Detail pane. Drag the divider or use the arrow keys.</div>
    </UiSplit>
  );
}
// @end

// @example ui-virtual-list
function VirtualListExample() {
  return <UiVirtualList count={10000} rowHeight={36} height={200} label="Ten thousand items" renderRow={(i: number) => <span>Item {i + 1}</span>} />;
}
// @end

// @example ui-file-upload
function FileUploadExample() {
  return <UiFileUpload label="Attachments" accept=".pdf,.png" maxSize={5242880} maxFiles={3} />;
}
// @end

// @example ui-collapse
function CollapseExample() {
  return (
    <UiCollapse peek="Shipping, returns and exchanges">
      <span slot="label">Delivery</span>
      Full delivery details appear here.
    </UiCollapse>
  );
}
// @end

// @example ui-theme-toggle
function ThemeToggleExample() {
  return <UiThemeToggle />;
}
// @end

export const EXAMPLES: Record<string, () => ReactElement> = {
  'ui-button': ButtonExample,
  'ui-icon': IconExample,
  'ui-input': InputExample,
  'ui-textarea': TextareaExample,
  'ui-checkbox': CheckboxExample,
  'ui-switch': SwitchExample,
  'ui-radio-group': RadioExample,
  'ui-slider': SliderExample,
  'ui-rating': RatingExample,
  'ui-select': SelectExample,
  'ui-date-picker': DatePickerExample,
  'ui-date-range-picker': DateRangeExample,
  'ui-time-picker': TimeExample,
  'ui-color-picker': ColourExample,
  'ui-alert': AlertExample,
  'ui-badge': BadgeExample,
  'ui-avatar': AvatarExample,
  'ui-progress': ProgressExample,
  'ui-spinner': SpinnerExample,
  'ui-counter': CounterExample,
  'ui-toaster': ToasterExample,
  'ui-modal': ModalExample,
  'ui-dropdown': DropdownExample,
  'ui-tooltip': TooltipExample,
  'ui-tabs': TabsExample,
  'ui-accordion': AccordionExample,
  'ui-pagination': PaginationExample,
  'ui-stepper': StepperExample,
  'ui-table': TableExample,
  'ui-tree': TreeExample,
  'ui-sortable': SortableExample,
  'ui-kanban': KanbanExample,
  'ui-scheduler': SchedulerExample,
  'ui-chart': ChartExample,
  'ui-sparkline': SparklineExample,
  'ui-card': CardExample,
  'ui-split': SplitExample,
  'ui-virtual-list': VirtualListExample,
  'ui-file-upload': FileUploadExample,
  'ui-collapse': CollapseExample,
  'ui-theme-toggle': ThemeToggleExample,
};
