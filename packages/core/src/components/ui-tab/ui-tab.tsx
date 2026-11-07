import { Component, Host, Prop, h } from '@stencil/core';

/** A tab button. Must be a direct child of <ui-tabs>, which manages selection. */
@Component({
  tag: 'ui-tab',
  styleUrl: 'ui-tab.css',
  shadow: true,
})
export class UiTab {
  @Prop() value!: string;
  @Prop({ reflect: true }) disabled = false;
  /** Managed by the parent. */
  @Prop({ mutable: true, reflect: true }) selected = false;

  render() {
    return (
      <Host role="tab" slot="tab" aria-selected={this.selected ? 'true' : 'false'} aria-disabled={this.disabled ? 'true' : undefined} tabindex={this.selected ? 0 : -1}>
        <slot />
      </Host>
    );
  }
}
