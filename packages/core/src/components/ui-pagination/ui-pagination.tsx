import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';

/** Page numbers with ellipses: always the boundaries, plus `siblings` pages around the current one. */
function buildPages(page: number, count: number, siblings: number, boundaries: number): Array<number | 'gap'> {
  const set = new Set<number>();
  for (let i = 1; i <= Math.min(boundaries, count); i++) set.add(i);
  for (let i = Math.max(1, count - boundaries + 1); i <= count; i++) set.add(i);
  for (let i = Math.max(1, page - siblings); i <= Math.min(count, page + siblings); i++) set.add(i);
  const sorted = Array.from(set).sort((a, b) => a - b);
  const out: Array<number | 'gap'> = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev === 2) out.push(prev + 1); // a single hidden page reads better as the page itself
    else if (p - prev > 2) out.push('gap');
    out.push(p);
    prev = p;
  }
  return out;
}

@Component({
  tag: 'ui-pagination',
  styleUrl: 'ui-pagination.css',
  shadow: true,
})
export class UiPagination {
  /** Current page, 1-based. */
  @Prop({ mutable: true }) page = 1;
  /** Total pages. Or pass `total` items and a `pageSize`. */
  @Prop() pageCount?: number;
  @Prop() total?: number;
  @Prop() pageSize = 10;
  /** Pages shown on each side of the current page. */
  @Prop() siblings = 1;
  /** Pages always shown at each end. */
  @Prop() boundaries = 1;
  @Prop() label = 'Pagination';
  @Prop({ reflect: true }) size: 'sm' | 'md' = 'md';

  @Event() uiChange!: EventEmitter<number>;

  private count(): number {
    if (this.pageCount != null) return Math.max(1, this.pageCount);
    if (this.total != null) return Math.max(1, Math.ceil(this.total / this.pageSize));
    return 1;
  }

  private go(p: number) {
    const next = Math.min(this.count(), Math.max(1, p));
    if (next === this.page) return;
    this.page = next;
    this.uiChange.emit(next);
  }

  render() {
    const count = this.count();
    const page = Math.min(this.page, count);
    const pages = buildPages(page, count, this.siblings, this.boundaries);
    return (
      <Host>
        <nav aria-label={this.label}>
          <ul class="list">
            <li>
              <button type="button" class="btn nav" aria-label="Previous page" disabled={page <= 1} onClick={() => this.go(page - 1)}>
                <ui-icon name="chevron-left" />
              </button>
            </li>
            {pages.map((p, i) =>
              p === 'gap' ? (
                <li class="gap" aria-hidden="true" key={`gap-${i}`}>
                  &hellip;
                </li>
              ) : (
                <li key={p}>
                  <button
                    type="button"
                    class={{ btn: true, current: p === page }}
                    aria-label={`Page ${p}`}
                    aria-current={p === page ? 'page' : undefined}
                    onClick={() => this.go(p)}
                  >
                    {p}
                  </button>
                </li>
              ),
            )}
            <li>
              <button type="button" class="btn nav" aria-label="Next page" disabled={page >= count} onClick={() => this.go(page + 1)}>
                <ui-icon name="chevron-right" />
              </button>
            </li>
          </ul>
        </nav>
      </Host>
    );
  }
}
