import { Component, Element, Event, EventEmitter, Host, Method, Prop, h } from '@stencil/core';
import { MenuItemEl, enabledItems, handleMenuKeys } from '../../utils/menu-nav';

@Component({
  tag: 'ui-menubar-menu',
  styleUrl: 'ui-menubar-menu.css',
  shadow: true,
})
export class UiMenubarMenu {
  @Element() host!: HTMLElement;

  /** Text of the top-level button, e.g. "File". */
  @Prop() label!: string;
  @Prop({ mutable: true, reflect: true }) open = false;
  @Prop({ reflect: true }) disabled = false;
  /** Managed by <ui-menubar>: only one trigger is in the tab order. */
  @Prop() roving = false;

  /** Fires when a menu item is chosen. */
  @Event() uiSelect!: EventEmitter<{ value: string; label: string }>;
  /** Asks the menubar to move to the previous (-1) or next (1) menu. */
  @Event() uiNavigate!: EventEmitter<number>;

  private button?: HTMLButtonElement;
  private skipFocus = false;

  @Method() async focusTrigger() {
    this.button?.focus();
  }

  @Method() async openMenu(focusFirst = true) {
    this.skipFocus = !focusFirst;
    this.open = true;
  }

  private items(): MenuItemEl[] {
    return enabledItems(this.host.querySelectorAll('ui-menu-item'));
  }

  private onShow = () => {
    if (this.skipFocus) {
      this.skipFocus = false;
      return;
    }
    requestAnimationFrame(() => this.items()[0]?.focus());
  };

  private onTriggerKeyDown = (e: KeyboardEvent) => {
    if (!this.open && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      e.preventDefault();
      this.uiNavigate.emit(e.key === 'ArrowRight' ? 1 : -1);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      this.open = true;
    }
  };

  private onMenuKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      this.open = false;
      return;
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      this.uiNavigate.emit(e.key === 'ArrowRight' ? 1 : -1);
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
      <Host role="none">
        <ui-popover open={this.open} placement="bottom-start" offset={4} panelRole="menu" onUiOpenChange={(e) => (this.open = e.detail)} onUiShow={this.onShow}>
          <button
            slot="trigger"
            type="button"
            class="trigger"
            role="menuitem"
            ref={(el) => (this.button = el)}
            tabindex={this.roving ? 0 : -1}
            disabled={this.disabled}
            onKeyDown={this.onTriggerKeyDown}
          >
            {this.label}
          </button>
          <div class="menu" role="menu" onKeyDown={this.onMenuKeyDown} onClick={this.onMenuClick}>
            <slot />
          </div>
        </ui-popover>
      </Host>
    );
  }
}
