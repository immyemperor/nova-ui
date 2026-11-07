import { Component, Element, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { MenuItemEl, enabledItems, handleMenuKeys } from '../../utils/menu-nav';

/** Right-click menu for the content in the default slot. Menu items go in slot="menu". */
@Component({
  tag: 'ui-context-menu',
  styleUrl: 'ui-context-menu.css',
  shadow: true,
})
export class UiContextMenu {
  @Element() host!: HTMLElement;

  @Prop() disabled = false;
  @State() open = false;

  @Event() uiSelect!: EventEmitter<{ value: string; label: string }>;

  private popover?: HTMLElement & { showAt: (x: number, y: number) => Promise<void> };

  private items(): MenuItemEl[] {
    return enabledItems(this.host.querySelectorAll('[slot="menu"] ui-menu-item, ui-menu-item[slot="menu"]'));
  }

  private onContextMenu = (e: MouseEvent) => {
    if (this.disabled) return;
    e.preventDefault();
    this.popover?.showAt(e.clientX, e.clientY);
  };

  private onMenuKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      this.open = false;
      return;
    }
    handleMenuKeys(e, this.items());
  };

  private onMenuClick = (e: MouseEvent) => {
    const item = (e.target as HTMLElement).closest('ui-menu-item') as (MenuItemEl & { value?: string }) | null;
    if (!item || item.disabled) return;
    const label = (item.textContent ?? '').trim();
    this.uiSelect.emit({ value: item.value ?? label, label });
    this.open = false;
  };

  render() {
    return (
      <Host onContextMenu={this.onContextMenu}>
        <slot />
        <ui-popover
          ref={(el) => (this.popover = el as any)}
          open={this.open}
          trigger="manual"
          panelRole="menu"
          onUiOpenChange={(e) => (this.open = e.detail)}
          onUiShow={() => requestAnimationFrame(() => this.items()[0]?.focus())}
        >
          <div class="menu" role="menu" onKeyDown={this.onMenuKeyDown} onClick={this.onMenuClick}>
            <slot name="menu" />
          </div>
        </ui-popover>
      </Host>
    );
  }
}
