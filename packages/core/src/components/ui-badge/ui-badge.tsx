import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'ui-badge',
  styleUrl: 'ui-badge.css',
  shadow: true,
})
export class UiBadge {
  @Prop({ reflect: true }) tone: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info' = 'neutral';
  @Prop({ reflect: true }) variant: 'soft' | 'solid' | 'outline' = 'soft';
  /** Leading status dot. */
  @Prop() dot = false;

  render() {
    return (
      <Host>
        {this.dot && <span class="dot" aria-hidden="true" />}
        <slot />
      </Host>
    );
  }
}
