import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'ui-tab-panel',
  styleUrl: 'ui-tab-panel.css',
  shadow: true,
})
export class UiTabPanel {
  /** Matches the value of its <ui-tab>. */
  @Prop() value!: string;
  /** Managed by the parent. */
  @Prop({ mutable: true, reflect: true }) selected = false;

  render() {
    return (
      <Host role="tabpanel" tabindex="0" hidden={!this.selected}>
        <slot />
      </Host>
    );
  }
}
