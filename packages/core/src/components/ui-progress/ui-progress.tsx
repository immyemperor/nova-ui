import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'ui-progress',
  styleUrl: 'ui-progress.css',
  shadow: true,
})
export class UiProgress {
  /** Current value. Leave unset for an indeterminate bar. */
  @Prop() value?: number;
  @Prop() max = 100;
  @Prop() label?: string;
  @Prop() showValue = false;
  @Prop({ reflect: true }) tone: 'accent' | 'success' | 'warning' | 'danger' = 'accent';

  render() {
    const determinate = this.value != null;
    const pct = determinate ? Math.min(100, Math.max(0, (this.value! / this.max) * 100)) : 0;
    return (
      <Host>
        {(this.label || (this.showValue && determinate)) && (
          <div class="head">
            <span class="label">{this.label}</span>
            {this.showValue && determinate && <span class="value">{Math.round(pct)}%</span>}
          </div>
        )}
        <div
          class="track"
          role="progressbar"
          aria-label={this.label}
          aria-valuemin={0}
          aria-valuemax={this.max}
          aria-valuenow={determinate ? this.value : undefined}
          data-indeterminate={determinate ? 'false' : 'true'}
        >
          <div class="bar" style={determinate ? { width: `${pct}%` } : undefined} />
        </div>
      </Host>
    );
  }
}
