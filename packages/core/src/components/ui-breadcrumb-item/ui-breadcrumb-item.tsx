import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'ui-breadcrumb-item',
  styleUrl: 'ui-breadcrumb-item.css',
  shadow: true,
})
export class UiBreadcrumbItem {
  /** Omit for items that aren't links. */
  @Prop() href?: string;
  /** Mark the current page explicitly. The last item is treated as current automatically. */
  @Prop({ reflect: true }) current = false;
  /** Managed by <ui-breadcrumb>. */
  @Prop({ reflect: true }) last = false;
  @Prop({ reflect: true }) collapsed = false;
  @Prop({ reflect: true }) ellipsis = false;

  @Event() uiExpand!: EventEmitter<void>;

  render() {
    const isCurrent = this.current || this.last;
    return (
      <Host role="listitem">
        {this.ellipsis ? (
          <button type="button" class="ellipsis" aria-label="Show full path" onClick={() => this.uiExpand.emit()}>
            &hellip;
          </button>
        ) : isCurrent || !this.href ? (
          <span class="text" aria-current={isCurrent ? 'page' : undefined}>
            <slot />
          </span>
        ) : (
          <a class="link" href={this.href}>
            <slot />
          </a>
        )}
        {!this.last && <ui-icon class="sep" name="chevron-right" />}
      </Host>
    );
  }
}
