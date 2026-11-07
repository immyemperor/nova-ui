import { Component, Host, Prop, State, h } from '@stencil/core';

/** One entry in a <ui-dropdown> or <ui-context-menu>. */
@Component({
  tag: 'ui-menu-item',
  styleUrl: 'ui-menu-item.css',
  shadow: true,
})
export class UiMenuItem {
  /** Returned in the parent's uiSelect event. Defaults to the item's text. */
  @Prop() value?: string;
  @Prop({ reflect: true }) disabled = false;
  @Prop({ reflect: true }) tone: 'default' | 'danger' = 'default';
  /** Draw a separator line above this item. */
  @Prop({ reflect: true }) divider = false;
  /** Display-only shortcut hint, e.g. "Ctrl S". */
  @Prop() shortcut?: string;

  @State() hasIcon = false;

  render() {
    return (
      <Host role="menuitem" tabindex="-1" aria-disabled={this.disabled ? 'true' : undefined}>
        <span class="icon" hidden={!this.hasIcon}>
          <slot name="icon" onSlotchange={(e) => (this.hasIcon = (e.target as HTMLSlotElement).assignedNodes().length > 0)} />
        </span>
        <span class="label">
          <slot />
        </span>
        {this.shortcut && <kbd class="shortcut">{this.shortcut}</kbd>}
      </Host>
    );
  }
}
