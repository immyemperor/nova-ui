import { Component, Element, Host, Prop, h } from '@stencil/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  tag: 'ui-button',
  styleUrl: 'ui-button.css',
  shadow: { delegatesFocus: true },
})
export class UiButton {
  @Element() el!: HTMLElement;

  @Prop({ reflect: true }) variant: ButtonVariant = 'primary';
  @Prop({ reflect: true }) size: ButtonSize = 'md';
  @Prop({ reflect: true }) disabled = false;
  /** Shows a spinner and blocks clicks while work is in flight. */
  @Prop({ reflect: true }) loading = false;
  /** Square button for a single icon. Provide `label` for screen readers. */
  @Prop({ reflect: true }) iconOnly = false;
  @Prop() type: 'button' | 'submit' | 'reset' = 'button';
  /** Accessible name; required when iconOnly is set. */
  @Prop() label?: string;
  /** Render as a link when set. */
  @Prop() href?: string;
  @Prop() target?: string;

  private handleClick = (ev: MouseEvent) => {
    if (this.disabled || this.loading) {
      ev.preventDefault();
      ev.stopPropagation();
      return;
    }
    // Shadow DOM buttons can't submit light DOM forms on their own.
    const form = this.el.closest('form');
    if (form && !this.href) {
      if (this.type === 'submit') form.requestSubmit();
      else if (this.type === 'reset') form.reset();
    }
  };

  render() {
    const inert = this.disabled || this.loading;
    const Tag = this.href ? 'a' : 'button';
    const attrs = this.href
      ? { href: inert ? undefined : this.href, target: this.target, rel: this.target === '_blank' ? 'noopener noreferrer' : undefined, role: inert ? 'link' : undefined }
      : { type: 'button' as const, disabled: inert };
    return (
      <Host>
        <Tag
          part="control"
          class="control"
          aria-label={this.label}
          aria-busy={this.loading ? 'true' : undefined}
          aria-disabled={inert ? 'true' : undefined}
          onClick={this.handleClick}
          {...attrs}
        >
          {this.loading && <span class="spinner" aria-hidden="true" />}
          <slot name="start" />
          <span class="label">
            <slot />
          </span>
          <slot name="end" />
        </Tag>
      </Host>
    );
  }
}
