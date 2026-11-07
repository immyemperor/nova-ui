import { Component, Element, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import { MenuItemEl, enabledItems, handleMenuKeys } from '../../utils/menu-nav';
import type { Placement } from '../../utils/position';

/**
 * Action menu. Put the trigger in slot="trigger" and <ui-menu-item> children in the default slot.
 * Arrow keys, Home/End, type-ahead, Enter/Space and Escape all work.
 */
@Component({
  tag: 'ui-dropdown',
  styleUrl: 'ui-dropdown.css',
  shadow: true,
})
export class UiDropdown {
  @Element() host!: HTMLElement;

  @Prop({ mutable: true, reflect: true }) open = false;
  @Prop() placement: Placement = 'bottom-start';

  /** Fires when an item is chosen. */
  @Event() uiSelect!: EventEmitter<{ value: string; label: string }>;
  @Event() uiOpenChange!: EventEmitter<boolean>;

  private items(): MenuItemEl[] {
    return enabledItems(this.host.querySelectorAll('ui-menu-item'));
  }

  private onShow = () => {
    // Wait a frame so the panel is laid out and focusable.
    requestAnimationFrame(() => this.items()[0]?.focus());
  };

  private onTriggerKeyDown = (e: KeyboardEvent) => {
    if (!this.open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      this.open = true;
      this.uiOpenChange.emit(true);
    }
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
    this.uiOpenChange.emit(false);
  };

  render() {
    return (
      <Host>
        <ui-popover
          open={this.open}
          placement={this.placement}
          panelRole="menu"
          onUiOpenChange={(e) => {
            this.open = e.detail;
            this.uiOpenChange.emit(e.detail);
          }}
          onUiShow={this.onShow}
        >
          <slot
            name="trigger"
            slot="trigger"
            {...({ onKeyDown: this.onTriggerKeyDown } as any)}
          />
          <div class="menu" role="menu" onKeyDown={this.onMenuKeyDown} onClick={this.onMenuClick}>
            <slot />
          </div>
        </ui-popover>
      </Host>
    );
  }
}
