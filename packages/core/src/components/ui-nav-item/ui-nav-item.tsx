import { Component, Event, EventEmitter, Host, Method, Prop, h } from '@stencil/core';

@Component({
  tag: 'ui-nav-item',
  styleUrl: 'ui-nav-item.css',
  shadow: true,
})
export class UiNavItem {
  /** Text of the link or button. */
  @Prop() label?: string;
  /** Makes this a plain link. Leave out to make it a button that opens the panel. */
  @Prop() href?: string;
  @Prop({ reflect: true }) current = false;
  @Prop({ mutable: true, reflect: true }) open = false;

  /** Fires when the panel opens or closes. Bubbles so <ui-nav-menu> can close siblings. */
  @Event() uiToggle!: EventEmitter<boolean>;

  private control?: HTMLElement;

  @Method() async focusTrigger() {
    this.control?.focus();
  }

  private onPanelClick = (e: MouseEvent) => {
    // Close after choosing a link inside the panel (single-page apps don't reload).
    if ((e.target as HTMLElement).closest('a')) {
      this.open = false;
      this.uiToggle.emit(false);
    }
  };

  render() {
    if (this.href) {
      return (
        <Host role="listitem">
          <a class="link" href={this.href} ref={(el) => (this.control = el)} aria-current={this.current ? 'page' : undefined}>
            {this.label}
            <slot name="label" />
          </a>
        </Host>
      );
    }
    return (
      <Host role="listitem">
        <ui-popover
          open={this.open}
          placement="bottom-start"
          panelRole="none"
          onUiOpenChange={(e) => {
            this.open = e.detail;
            this.uiToggle.emit(e.detail);
          }}
        >
          <button slot="trigger" type="button" class="link" ref={(el) => (this.control = el)} aria-expanded={this.open ? 'true' : 'false'}>
            {this.label}
            <slot name="label" />
            <ui-icon class="chevron" name="chevron-down" />
          </button>
          <div class="panel" onClick={this.onPanelClick}>
            <slot />
          </div>
        </ui-popover>
      </Host>
    );
  }
}
