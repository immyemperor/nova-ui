import { useState } from 'react';
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
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [palette, setPalette] = useState(false);

  return (
    <section style={{ display: 'grid', gap: '1.25rem' }}>
      <h2 style={{ margin: 0, fontSize: '1.125rem' }}>Overlays</h2>
      <UiToaster />

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <UiButton onClick={() => setModal(true)}>Open modal</UiButton>
        <UiButton variant="secondary" onClick={() => setDrawer(true)}>Open drawer</UiButton>
        <UiButton variant="secondary" onClick={() => setPalette(true)}>
          <UiIcon slot="start" name="search" />
          Command palette (Ctrl/Cmd+K)
        </UiButton>

        <UiTooltip content="Saved 2 minutes ago">
          <UiButton variant="ghost">Hover or focus me</UiButton>
        </UiTooltip>

        <UiPopover label="Share options">
          <UiButton slot="trigger" variant="secondary">Popover</UiButton>
          <div style={{ display: 'grid', gap: '0.5rem', minWidth: '14rem' }}>
            <strong>Share this page</strong>
            <span style={{ color: 'var(--nova-color-fg-muted)' }}>Anyone with the link can view.</span>
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

      <div style={{ display: 'grid', gap: '1rem', maxWidth: 420 }}>
        <UiSelect label="Assignee" placeholder="Search people" options={people} clearable />
        <UiSelect label="Reviewers" placeholder="Add reviewers" options={people} multiple />
      </div>

      <UiContextMenu onUiSelect={(e) => toast(`Context: ${e.detail.label}`)}>
        <div style={{ padding: '2rem', border: '1px dashed var(--nova-color-border-strong)', borderRadius: 12, textAlign: 'center', color: 'var(--nova-color-fg-muted)' }}>
          Right-click anywhere in this box
        </div>
        <UiMenuItem slot="menu" value="copy">Copy</UiMenuItem>
        <UiMenuItem slot="menu" value="paste">Paste</UiMenuItem>
        <UiMenuItem slot="menu" value="remove" tone="danger" divider>Remove</UiMenuItem>
      </UiContextMenu>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <UiButton variant="ghost" onClick={() => toast.success({ title: 'Saved', description: 'Your changes are live.' })}>Success toast</UiButton>
        <UiButton variant="ghost" onClick={() => toast.error({ title: 'Upload failed', description: 'Check your connection.', actionLabel: 'Retry', onAction: () => toast('Retrying...') })}>Error toast</UiButton>
      </div>

      <UiModal open={modal} heading="Delete project?" size="sm" onUiClose={() => setModal(false)}>
        This permanently removes the project and its files. This can't be undone.
        <div slot="footer" style={{ display: 'contents' }}>
          <UiButton variant="ghost" onClick={() => setModal(false)}>Cancel</UiButton>
          <UiButton variant="danger" onClick={() => { setModal(false); toast.error('Project deleted'); }}>Delete</UiButton>
        </div>
      </UiModal>

      <UiDrawer open={drawer} heading="Filters" onUiClose={() => setDrawer(false)}>
        <p style={{ marginTop: 0 }}>Drawer content goes here.</p>
        <UiSelect label="Status" options={[{ value: 'open', label: 'Open' }, { value: 'done', label: 'Done' }]} />
        <div slot="footer" style={{ display: 'contents' }}>
          <UiButton onClick={() => setDrawer(false)}>Apply</UiButton>
        </div>
      </UiDrawer>

      <UiCommandPalette
        open={palette}
        commands={commands}
        onUiOpenChange={(e) => setPalette(e.detail)}
        onUiSelect={(e) => toast.info(`Ran: ${e.detail.label}`)}
      />
    </section>
  );
}
