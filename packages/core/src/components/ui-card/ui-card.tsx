import { Component, Element, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'ui-card',
  styleUrl: 'ui-card.css',
  shadow: true,
})
export class UiCard {
  @Element() host!: HTMLElement;

  @Prop({ reflect: true }) variant: 'outlined' | 'raised' | 'flat' = 'outlined';
  /** Adds hover and focus states. Wrap the card in a link or button for the actual action. */
  @Prop({ reflect: true }) interactive = false;

  render() {
    const has = (slot: string) => !!this.host.querySelector(`:scope > [slot="${slot}"]`);
    return (
      <Host>
        {has('header') && (
          <header class="header">
            <slot name="header" />
          </header>
        )}
        <div class="body">
          <slot />
        </div>
        {has('footer') && (
          <footer class="footer">
            <slot name="footer" />
          </footer>
        )}
      </Host>
    );
  }
}
