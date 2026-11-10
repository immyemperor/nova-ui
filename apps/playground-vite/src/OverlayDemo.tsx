import { useRef } from 'react';
import {
  UiButton, UiCommandPalette, UiContextMenu, UiDrawer, UiDropdown, UiIcon, UiMenuItem, UiModal,
  UiPopover, UiSelect, UiToaster, UiTooltip, toast,
} from '@nova-ui/react';
import type { Command, SelectOption } from '@nova-ui/react';

const people: SelectOption[] = [
  { value: 'ada', label: 'Ada Lovelace', description: 'Engineering' },
  { value: 'grace', label: 'Grace Hopper', description: 'Compilers' },
  { value: 'linus', label: 'Linus Torvalds', description: 'Kernel' },
  { value: 'margaret', label: 'Margaret Hamilton', description: 'Flight software' },
  { value: 'tim', label: 'Tim Berners-Lee', description: 'Web', disabled: true },
];

const commands: Command[] = [
  { id: 'new', label: 'New document', group: 'File', icon: 'plus', shortcut: 'N' },
  { id: 'upload', label: 'Upload file', group: 'File', icon: 'upload', keywords: ['import'] },
  { id: 'theme', label: 'Toggle theme', group: 'View', icon: 'sun', keywords: ['dark', 'light'] },
  { id: 'delete', label: 'Delete workspace', group: 'Danger', icon: 'trash', disabled: true },
];

export function OverlayDemo() {
  const modalRef = useRef<any>(null);
  const drawerRef = useRef<any>(null);
  const paletteRef = useRef<any>(null);

  return (
    <section className="nova-stack" id="overlays">
      <h2 className="nova-h3">Overlays</h2>
      <UiToaster />

      <div className="nova-cluster">
        <button className="nova-btn" type="button" onClick={() => { modalRef.current.open = true; }}>Open modal</button>
        <button className="nova-btn nova-btn-secondary" type="button" onClick={() => { drawerRef.current.open = true; }}>Open drawer</button>
        <button className="nova-btn nova-btn-secondary" type="button" onClick={() => { paletteRef.current.open = true; }}>
          <UiIcon slot="start" name="search" />
          Command palette (Ctrl/Cmd+K)
        </button>

        <UiTooltip content="Saved 2 minutes ago">
          <UiButton variant="ghost">Hover or focus me</UiButton>
        </UiTooltip>

        <UiPopover label="Share options">
          <UiButton slot="trigger" variant="secondary">Popover</UiButton>
          <div className="nova-stack nova-stack-sm" style={{ minInlineSize: '14rem' }}>
            <strong>Share this page</strong>
            <span className="nova-text-muted">Anyone with the link can view.</span>
            <UiButton size="sm" onClick={() => toast.success('Link copied')}>Copy link</UiButton>
          </div>
        </UiPopover>

        <UiDropdown onUiSelect={(e) => toast.info(`Selected: ${e.detail.label}`)}>
          <UiButton slot="trigger" variant="secondary">
            Actions
            <UiIcon slot="end" name="chevron-down" />
          </UiButton>
          <UiMenuItem value="rename">Rename</UiMenuItem>
          <UiMenuItem value="duplicate" shortcut="Ctrl D">Duplicate</UiMenuItem>
          <UiMenuItem value="archive" disabled>Archive</UiMenuItem>
          <UiMenuItem value="delete" tone="danger" divider>Delete</UiMenuItem>
        </UiDropdown>
      </div>

      <div className="nova-stack nova-max-w-md">
        <UiSelect label="Assignee" placeholder="Search people" options={people} clearable />
        <UiSelect label="Reviewers" placeholder="Add reviewers" options={people} multiple />
      </div>

      <UiContextMenu onUiSelect={(e) => toast(`Context: ${e.detail.label}`)}>
        <div className="nova-p-6 nova-border nova-border-strong nova-rounded-lg nova-text-center nova-text-muted">
          Right-click anywhere in this box
        </div>
        <UiMenuItem slot="menu" value="copy">Copy</UiMenuItem>
        <UiMenuItem slot="menu" value="paste">Paste</UiMenuItem>
        <UiMenuItem slot="menu" value="remove" tone="danger" divider>Remove</UiMenuItem>
      </UiContextMenu>

      <div className="nova-cluster">
        <UiButton variant="ghost" onClick={() => toast.success({ title: 'Saved', description: 'Your changes are live.' })}>Success toast</UiButton>
        <UiButton variant="ghost" onClick={() => toast.error({ title: 'Upload failed', description: 'Check your connection.', actionLabel: 'Retry', onAction: () => toast('Retrying...') })}>Error toast</UiButton>
      </div>

      <UiModal ref={modalRef} heading="Delete project?" size="sm">
        This permanently removes the project and its files. This can't be undone.
        <div slot="footer" className="nova-d-contents">
          <button className="nova-btn nova-btn-ghost" type="button" onClick={() => { modalRef.current.open = false; }}>Cancel</button>
          <button className="nova-btn nova-btn-danger" type="button" onClick={() => { modalRef.current.open = false; toast.error('Project deleted'); }}>Delete</button>
        </div>
      </UiModal>

      <UiDrawer ref={drawerRef} heading="Filters">
        <p className="nova-mb-4">Drawer content goes here.</p>
        <UiSelect label="Status" options={[{ value: 'open', label: 'Open' }, { value: 'done', label: 'Done' }]} />
        <div slot="footer" className="nova-d-contents">
            <button className="nova-btn" type="button" onClick={() => { drawerRef.current.open = false; }}>Apply</button>
        </div>
      </UiDrawer>

      <UiCommandPalette
        ref={paletteRef}
        commands={commands}
        onUiSelect={(e) => toast.info(`Ran: ${e.detail.label}`)}
      />
    </section>
  );
}
