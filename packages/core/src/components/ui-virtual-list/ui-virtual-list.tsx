import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import { virtualRange } from '../../utils/virtual';

/**
 * Renders only the rows on screen for a list of thousands of items. Row heights are fixed (`rowHeight`).
 * Pass `renderRow(index)` as a function property; it returns the markup for one row.
 */
@Component({
  tag: 'ui-virtual-list',
  styleUrl: 'ui-virtual-list.css',
  shadow: true,
})
export class UiVirtualList {
  @Element() host!: HTMLElement;

  /** Number of rows in the full list. */
  @Prop() count = 0;
  @Prop() rowHeight = 40;
  @Prop() height = 360;
  /** Extra rows rendered above and below the viewport. */
  @Prop() overscan = 5;
  @Prop() label = 'List';
  /** Returns the element for row `index`. */
  @Prop() renderRow?: (index: number) => any;

  @State() scrollTop = 0;
  private viewport?: HTMLElement;

  private onScroll = () => {
    this.scrollTop = this.viewport?.scrollTop ?? 0;
  };

  render() {
    const win = virtualRange(this.scrollTop, this.height, this.rowHeight, this.count, this.overscan);
    const rows = [];
    for (let i = win.start; i < win.end; i++) {
      rows.push(
        <div key={i} class="row" role="listitem" aria-setsize={this.count} aria-posinset={i + 1} style={{ height: `${this.rowHeight}px` }}>
          {this.renderRow ? this.renderRow(i) : `Row ${i + 1}`}
        </div>,
      );
    }
    return (
      <Host>
        <div class="viewport" ref={(el) => (this.viewport = el)} role="list" aria-label={this.label} tabindex={0}
          style={{ height: `${this.height}px` }} onScroll={this.onScroll}>
          <div class="spacer" style={{ height: `${win.totalHeight}px` }}>
            <div class="window" style={{ transform: `translateY(${win.offsetTop}px)` }}>{rows}</div>
          </div>
        </div>
      </Host>
    );
  }
}
