import { Component, Element, Event, EventEmitter, Host, Prop, h } from '@stencil/core';

/**
 * App sidebar: a navigation column that collapses to an icon rail (`collapsed`), and becomes an
 * off-canvas drawer on phones. Put <ui-sidebar-item> children inside, optionally in groups.
 * Sidebar and the page's own layout: pair it with `.nova-shell-sidebar` from @kvui/css.
 */
@Component({
  tag: 'ui-sidebar',
  styleUrl: 'ui-sidebar.css',
  shadow: true,
})
export class UiSidebar {
  @Element() host!: HTMLElement;

  /** Show icons only, with labels as tooltips. */
  @Prop({ mutable: true, reflect: true }) collapsed = false;
  /** Accessible name of the navigation landmark. */
  @Prop() label = 'Main';
  /** Collapsed state is remembered under this key in localStorage (leave empty to disable). */
  @Prop() storageKey?: string;

  @Event() uiCollapse!: EventEmitter<boolean>;

  componentWillLoad() {
    if (this.storageKey) {
      try {
        const saved = localStorage.getItem(this.storageKey);
        if (saved === '1' || saved === '0') this.collapsed = saved === '1';
      } catch { /* storage blocked: keep the prop value */ }
    }
  }

  private toggle = () => {
    this.collapsed = !this.collapsed;
    if (this.storageKey) {
      try { localStorage.setItem(this.storageKey, this.collapsed ? '1' : '0'); } catch { /* ignore */ }
    }
    this.uiCollapse.emit(this.collapsed);
  };

  /** Items read this attribute to hide labels and show tooltips, without :host-context(). */
  private markItems() {
    this.host.querySelectorAll('ui-sidebar-item').forEach((el) => {
      if (this.collapsed) el.setAttribute('data-collapsed', '');
      else el.removeAttribute('data-collapsed');
    });
  }

  componentDidRender() { this.markItems(); }

  render() {
    return (
      <Host>
        <nav class="nav" aria-label={this.label}>
          <div class="top">
            <ui-button class="toggle" variant="ghost" size="sm" icon-only
              label={this.collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={this.collapsed ? 'false' : 'true'} onClick={this.toggle}>
              <ui-icon name={this.collapsed ? 'chevron-right' : 'chevron-left'} />
            </ui-button>
          </div>
          <ul class="list" role="list">
            <slot />
          </ul>
          <div class="foot">
            <slot name="footer" />
          </div>
        </nav>
      </Host>
    );
  }
}
