import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'ui-step',
  styleUrl: 'ui-step.css',
  shadow: true,
})
export class UiStep {
  @Prop() heading?: string;
  @Prop() description?: string;
  /** Flag this step as having a problem. */
  @Prop({ reflect: true }) error = false;

  /** Managed by <ui-stepper>. */
  @Prop() index = 0;
  @Prop({ reflect: true }) last = false;
  @Prop({ reflect: true }) status: 'complete' | 'current' | 'upcoming' | 'error' = 'upcoming';
  @Prop({ reflect: true }) clickable = false;
  @Prop({ reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal';

  render() {
    const marker =
      this.status === 'complete' ? <ui-icon name="check" /> : this.status === 'error' ? <ui-icon name="x" /> : <span class="num">{this.index + 1}</span>;
    const label = `Step ${this.index + 1}: ${this.heading ?? ''}`;
    return (
      <Host role="listitem" aria-current={this.status === 'current' ? 'step' : undefined}>
        <div class="rail">
          {this.clickable ? (
            <button type="button" class="marker" aria-label={`Go back to ${label}`}>
              {marker}
            </button>
          ) : (
            <span class="marker" aria-hidden="true">
              {marker}
            </span>
          )}
          {!this.last && <span class="line" aria-hidden="true" />}
        </div>
        <div class="body">
          {this.heading && <p class="title">{this.heading}</p>}
          {this.description && <p class="desc">{this.description}</p>}
          <slot />
        </div>
      </Host>
    );
  }
}
