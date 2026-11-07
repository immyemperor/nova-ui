import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'ui-spinner',
  styleUrl: 'ui-spinner.css',
  shadow: true,
})
export class UiSpinner {
  @Prop({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md';
  /** Announced to screen readers. Describe what is loading, e.g. "Loading results". */
  @Prop() label = 'Loading';

  render() {
    return (
      <Host role="status" aria-label={this.label}>
        <span class="ring" aria-hidden="true" />
      </Host>
    );
  }
}
