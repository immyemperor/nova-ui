import { Component, Element, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import { t } from '../../i18n';

const ICON: Record<string, string> = { info: 'info', success: 'check-circle', warning: 'alert-triangle', danger: 'alert-circle' };

@Component({
  tag: 'ui-alert',
  styleUrl: 'ui-alert.css',
  shadow: true,
})
export class UiAlert {
  @Element() host!: HTMLElement;

  @Prop({ reflect: true }) tone: 'info' | 'success' | 'warning' | 'danger' = 'info';
  /** Short summary line. Put details in the default slot. */
  @Prop() heading?: string;
  @Prop() dismissible = false;
  /** Set to false to hide. Dismissing sets this for you. */
  @Prop({ mutable: true, reflect: true }) open = true;

  /** Fires when the user dismisses the alert. */
  @Event() uiDismiss!: EventEmitter<void>;

  private dismiss = () => {
    this.open = false;
    this.uiDismiss.emit();
  };

  render() {
    if (!this.open) return <Host hidden />;
    // Urgent tones interrupt screen readers; the rest are announced politely.
    const role = this.tone === 'danger' || this.tone === 'warning' ? 'alert' : 'status';
    return (
      <Host role={role}>
        <ui-icon class="icon" name={ICON[this.tone]} size="1.25em" />
        <div class="content">
          {this.heading && <p class="heading">{this.heading}</p>}
          <div class="body">
            <slot />
          </div>
        </div>
        {this.dismissible && (
          <ui-button class="close" variant="ghost" size="sm" icon-only label={t('dismiss')} onClick={this.dismiss}>
            <ui-icon name="x" />
          </ui-button>
        )}
      </Host>
    );
  }
}
