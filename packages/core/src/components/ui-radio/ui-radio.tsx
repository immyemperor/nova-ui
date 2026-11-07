import { Component, Host, Prop, h } from '@stencil/core';

/** A single option. Must be placed inside <ui-radio-group>, which manages selection and focus. */
@Component({
  tag: 'ui-radio',
  styleUrl: 'ui-radio.css',
  shadow: true,
})
export class UiRadio {
  @Prop() value!: string;
  /** Managed by the parent group. */
  @Prop({ mutable: true, reflect: true }) checked = false;
  @Prop({ reflect: true }) disabled = false;

  render() {
    return (
      <Host role="radio" aria-checked={this.checked ? 'true' : 'false'} aria-disabled={this.disabled ? 'true' : undefined}>
        <span class="dot" aria-hidden="true" />
        <span class="text">
          <slot />
        </span>
      </Host>
    );
  }
}
