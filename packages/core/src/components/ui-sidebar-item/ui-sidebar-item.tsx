import { Component, Element, Event, EventEmitter, Host, Prop, h } from '@stencil/core';

/**
 * A link (href) or a group (children that expand). Current page is marked with aria-current="page".
 * Keyboard: Enter/Space activates; ArrowRight/Left expand/collapse a group.
 */
@Component({
  tag: 'ui-sidebar-item',
  styleUrl: 'ui-sidebar-item.css',
  shadow: true,
})
export class UiSidebarItem {
  @Element() host!: HTMLElement;

  @Prop() label!: string;
  @Prop() href?: string;
  /** Icon name from the registry, shown in both expanded and collapsed states. */
  @Prop() icon?: string;
  /** Badge text, e.g. an unread count. */
  @Prop() badge?: string;
  @Prop({ reflect: true }) current = false;
  /** Makes this item a group that shows its children when open. */
  @Prop({ reflect: true }) group = false;
  @Prop({ mutable: true, reflect: true }) open = false;
  /** Shown as a native tooltip when the sidebar is collapsed. */
  @Prop() tooltip?: string;

  @Event() uiSelect!: EventEmitter<{ label: string; href?: string }>;

  private onActivate = (e: Event) => {
    if (this.group) {
      e.preventDefault();
      this.open = !this.open;
      return;
    }
    this.uiSelect.emit({ label: this.label, href: this.href });
  };

  private onKey = (e: KeyboardEvent) => {
    if (!this.group) return;
    if (e.key === 'ArrowRight' && !this.open) { e.preventDefault(); this.open = true; }
    if (e.key === 'ArrowLeft' && this.open) { e.preventDefault(); this.open = false; }
  };

  render() {
    const inner = [
      this.icon && <ui-icon class="icon" name={this.icon} />,
      <span class="text">{this.label}</span>,
      this.badge && <span class="badge">{this.badge}</span>,
      this.group && <ui-icon class="chev" name="chevron-down" />,
    ];
    const common = {
      class: 'row',
      title: this.tooltip ?? this.label,
      'aria-current': this.current && !this.group ? 'page' : undefined,
    };
    return (
      <Host role="none">
        {this.group ? (
          <button type="button" {...common} aria-expanded={this.open ? 'true' : 'false'} onClick={this.onActivate} onKeyDown={this.onKey}>
            {inner}
          </button>
        ) : this.href ? (
          <a {...common} href={this.href} onClick={this.onActivate}>{inner}</a>
        ) : (
          <button type="button" {...common} onClick={this.onActivate}>{inner}</button>
        )}
        {this.group && (
          <ul class="children" role="list" hidden={!this.open}>
            <slot />
          </ul>
        )}
      </Host>
    );
  }
}
