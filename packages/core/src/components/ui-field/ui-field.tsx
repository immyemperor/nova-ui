import { Component, Host, Prop, h } from '@stencil/core';

let uid = 0;

/**
 * Wraps any form control with a label, hint, error and "required" marker, and links them
 * with aria-describedby. Use it for controls that have no label of their own (ui-slider with a custom
 * layout, ui-color-picker, a native <select>, or anything you build yourself).
 *   <ui-field label="Region" hint="Used for billing" error={err}><select>...</select></ui-field>
 */
@Component({
  tag: 'ui-field',
  styleUrl: 'ui-field.css',
  shadow: true,
})
export class UiField {
  private uid = `ui-field-${++uid}`;

  @Prop() label?: string;
  @Prop() hint?: string;
  @Prop() error?: string;
  @Prop() required = false;
  /** Lay the label beside the control (useful in dense settings screens). */
  @Prop({ reflect: true }) inline = false;

  render() {
    const hintId = `${this.uid}-hint`;
    const errId = `${this.uid}-err`;
    const describedBy = [this.error ? errId : null, this.hint && !this.error ? hintId : null].filter(Boolean).join(' ') || undefined;
    return (
      <Host>
        {this.label && (
          <span class="label" aria-hidden="false">
            {this.label}
            {this.required && <span class="req" aria-hidden="true"> *</span>}
          </span>
        )}
        <div class="control" data-describedby={describedBy}>
          <slot />
        </div>
        {this.error && <p class="msg error" id={errId} role="alert">{this.error}</p>}
        {!this.error && this.hint && <p class="msg" id={hintId}>{this.hint}</p>}
      </Host>
    );
  }
}
