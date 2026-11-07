import { Component, Element, Host, Listen, Prop, State, Watch, h } from '@stencil/core';

interface CrumbEl extends HTMLElement {
  last: boolean;
  collapsed: boolean;
  ellipsis: boolean;
}

/** Breadcrumb trail. Children are <ui-breadcrumb-item>; the last one is marked as the current page. */
@Component({
  tag: 'ui-breadcrumb',
  styleUrl: 'ui-breadcrumb.css',
  shadow: true,
})
export class UiBreadcrumb {
  @Element() host!: HTMLElement;

  /** Collapse the middle of long trails into an expandable "...". Minimum 2. */
  @Prop() maxItems?: number;
  @Prop() label = 'Breadcrumb';

  @State() expanded = false;

  private items(): CrumbEl[] {
    return Array.from(this.host.querySelectorAll(':scope > ui-breadcrumb-item')) as CrumbEl[];
  }

  @Watch('maxItems')
  @Watch('expanded')
  sync() {
    const items = this.items();
    const n = items.length;
    items.forEach((item, i) => {
      item.last = i === n - 1;
      item.collapsed = false;
      item.ellipsis = false;
    });
    const max = this.maxItems && this.maxItems >= 2 ? this.maxItems : undefined;
    if (max && !this.expanded && n > max) {
      // Keep the first item and the last (max - 1); fold everything between.
      const hidden = items.slice(1, n - (max - 1));
      hidden.forEach((item) => (item.collapsed = true));
      if (hidden[0]) hidden[0].ellipsis = true;
    }
  }

  @Listen('uiExpand')
  onExpand() {
    this.expanded = true;
  }

  componentDidLoad() {
    this.sync();
  }

  render() {
    return (
      <Host>
        <nav aria-label={this.label}>
          <div class="list" role="list">
            <slot onSlotchange={() => this.sync()} />
          </div>
        </nav>
      </Host>
    );
  }
}
