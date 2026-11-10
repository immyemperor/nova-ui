import { Component, Element, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import type { TableColumn, TableQuery, TableRow, TableSort } from '../../types';

function compare(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

/** Stable sort; empty values always sink to the bottom whichever way you sort. */
function sortRows(rows: TableRow[], sort: TableSort): TableRow[] {
  const dir = sort.dir === 'asc' ? 1 : -1;
  return rows
    .map((row, i) => ({ row, i }))
    .sort((x, y) => {
      const a = x.row[sort.key];
      const b = y.row[sort.key];
      const aEmpty = a == null || a === '';
      const bEmpty = b == null || b === '';
      if (aEmpty || bEmpty) return aEmpty === bEmpty ? x.i - y.i : aEmpty ? 1 : -1;
      return compare(a, b) * dir || x.i - y.i;
    })
    .map((x) => x.row);
}

/**
 * Data table with sorting, search, row selection and built-in pagination.
 * Works on all your rows in the browser, or in `manual` mode where you fetch each page
 * from a server in response to `uiQueryChange`.
 */
@Component({
  tag: 'ui-table',
  styleUrl: 'ui-table.css',
  shadow: true,
})
export class UiTable {
  @Element() host!: HTMLElement;

  @Prop() columns: TableColumn[] = [];
  @Prop() rows: TableRow[] = [];
  /** Property that uniquely identifies a row (used for selection and custom cell slots). */
  @Prop() rowKey = 'id';
  /** Accessible title for the table. */
  @Prop() caption?: string;

  @Prop({ mutable: true }) sort?: TableSort;
  @Prop({ mutable: true }) page = 1;
  @Prop({ mutable: true }) pageSize = 10;
  @Prop() pageSizeOptions: number[] = [10, 25, 50, 100];
  /** Turn pagination off to show every row. */
  @Prop() paginate = true;
  /** Server mode: `rows` is just the current page and `total` is the full count. */
  @Prop() manual = false;
  @Prop() total?: number;

  @Prop() searchable = false;
  @Prop() searchPlaceholder = 'Search';

  @Prop() selectable = false;
  /** Selected row keys. Survives page changes. */
  @Prop({ mutable: true }) selected: string[] = [];

  @Prop() loading = false;
  @Prop() emptyText = 'No results found';
  /** Make rows focusable and fire uiRowClick on click or Enter. */
  @Prop() rowClickable = false;
  @Prop({ reflect: true }) striped = false;
  @Prop({ reflect: true }) density: 'comfortable' | 'compact' = 'comfortable';
  /** Scroll the body inside this height (any CSS length). The header stays pinned. */
  @Prop() maxHeight?: string;

  @State() query = '';

  /** Fires whenever page, page size, sort or search changes. In manual mode, fetch from this. */
  @Event() uiQueryChange!: EventEmitter<TableQuery>;
  @Event() uiSelectionChange!: EventEmitter<string[]>;
  @Event() uiRowClick!: EventEmitter<TableRow>;

  private searchTimer?: ReturnType<typeof setTimeout>;

  disconnectedCallback() {
    if (this.searchTimer) clearTimeout(this.searchTimer);
  }

  private cellText(row: TableRow, col: TableColumn): string {
    const value = row[col.key];
    if (col.format) return col.format(value, row);
    if (value == null) return '';
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
  }

  private keyOf(row: TableRow, index: number): string {
    const k = row[this.rowKey];
    return k == null ? String(index) : String(k);
  }

  private emitQuery() {
    this.uiQueryChange.emit({ page: this.page, pageSize: this.pageSize, sort: this.sort, search: this.query });
  }

  private toggleSort(key: string) {
    const cur = this.sort;
    this.sort = !cur || cur.key !== key ? { key, dir: 'asc' } : cur.dir === 'asc' ? { key, dir: 'desc' } : undefined;
    this.page = 1;
    this.emitQuery();
  }

  private setPage(page: number) {
    if (page === this.page) return;
    this.page = page;
    this.emitQuery();
  }

  private setPageSize(size: number) {
    this.pageSize = size;
    this.page = 1;
    this.emitQuery();
  }

  private onSearch = (e: CustomEvent<string>) => {
    e.stopPropagation();
    this.query = e.detail;
    this.page = 1;
    if (this.searchTimer) clearTimeout(this.searchTimer);
    // Debounce so a server isn't hit on every keystroke.
    this.searchTimer = setTimeout(() => this.emitQuery(), this.manual ? 250 : 0);
  };

  private setSelected(next: string[]) {
    this.selected = next;
    this.uiSelectionChange.emit(next);
  }

  private toggleRow(key: string, checked: boolean) {
    const set = new Set(this.selected);
    if (checked) set.add(key);
    else set.delete(key);
    this.setSelected(Array.from(set));
  }

  private toggleAll(keys: string[], checked: boolean) {
    const set = new Set(this.selected);
    keys.forEach((k) => (checked ? set.add(k) : set.delete(k)));
    this.setSelected(Array.from(set));
  }

  private onRowActivate(ev: Event, row: TableRow) {
    if (!this.rowClickable) return;
    // Don't treat clicks on controls inside the row as row clicks.
    if ((ev.target as HTMLElement).closest('button, a, input, select, ui-checkbox, ui-button')) return;
    this.uiRowClick.emit(row);
  }

  render() {
    // 1. filter and sort (browser mode only)
    let data = this.rows;
    if (!this.manual) {
      const q = this.query.trim().toLowerCase();
      if (q) data = data.filter((r) => this.columns.some((c) => this.cellText(r, c).toLowerCase().includes(q)));
      if (this.sort) data = sortRows(data, this.sort);
    }

    // 2. paginate
    const total = this.manual ? this.total ?? this.rows.length : data.length;
    const pageCount = this.paginate ? Math.max(1, Math.ceil(total / this.pageSize)) : 1;
    const page = Math.min(this.page, pageCount);
    const visible = this.paginate && !this.manual ? data.slice((page - 1) * this.pageSize, page * this.pageSize) : data;
    const from = total === 0 ? 0 : this.paginate ? (page - 1) * this.pageSize + 1 : 1;
    const to = this.paginate ? from - 1 + visible.length : total;

    // 3. selection state for the visible rows
    const keys = visible.map((r, i) => this.keyOf(r, (page - 1) * this.pageSize + i));
    const selectedSet = new Set(this.selected);
    const selectedHere = keys.filter((k) => selectedSet.has(k)).length;
    const allHere = keys.length > 0 && selectedHere === keys.length;

    const colCount = this.columns.length + (this.selectable ? 1 : 0);
    const hasToolbar = this.searchable || this.selected.length > 0 || !!this.host.querySelector(':scope > [slot="toolbar"]');
    const scrolls = !!this.maxHeight;

    return (
      <Host>
        {hasToolbar && (
          <div class="toolbar">
            {this.searchable && (
              <ui-input
                class="search"
                type="search"
                label="Search table"
                hideLabel
                size="sm"
                placeholder={this.searchPlaceholder}
                value={this.query}
                onUiInput={this.onSearch}
              >
                <ui-icon slot="prefix" name="search" />
              </ui-input>
            )}
            {this.selected.length > 0 && (
              <div class="bulk" role="status">
                <span>{this.selected.length} selected</span>
                <ui-button size="sm" variant="ghost" onClick={() => this.setSelected([])}>
                  Clear
                </ui-button>
                <slot name="bulk-actions" />
              </div>
            )}
            <div class="toolbar-extra">
              <slot name="toolbar" />
            </div>
          </div>
        )}

        <div
          class={{ scroll: true, scrolls }}
          style={scrolls ? { '--_max': this.maxHeight } : undefined}
          tabindex={scrolls ? 0 : undefined}
          role={scrolls ? 'region' : undefined}
          aria-label={scrolls ? this.caption ?? 'Table' : undefined}
        >
          <table aria-busy={this.loading ? 'true' : undefined} aria-rowcount={total}>
            {this.caption && <caption class="caption">{this.caption}</caption>}
            <thead>
              <tr>
                {this.selectable && (
                  <th class="select-col" scope="col">
                    <ui-checkbox
                      label="Select all rows on this page"
                      checked={allHere}
                      indeterminate={selectedHere > 0 && !allHere}
                      disabled={keys.length === 0}
                      onUiChange={(e) => {
                        e.stopPropagation();
                        this.toggleAll(keys, e.detail);
                      }}
                    />
                  </th>
                )}
                {this.columns.map((c) => {
                  const active = this.sort?.key === c.key ? this.sort : undefined;
                  return (
                    <th
                      key={c.key}
                      scope="col"
                      class={{ [`align-${c.align ?? 'start'}`]: true, sortable: !!c.sortable }}
                      style={c.width ? { width: c.width } : undefined}
                      aria-sort={c.sortable ? (active ? (active.dir === 'asc' ? 'ascending' : 'descending') : 'none') : undefined}
                    >
                      {c.sortable ? (
                        <button type="button" class="sort-btn" onClick={() => this.toggleSort(c.key)}>
                          {c.label}
                          <ui-icon class={{ 'sort-icon': true, on: !!active }} name={active?.dir === 'asc' ? 'chevron-up' : 'chevron-down'} />
                        </button>
                      ) : (
                        c.label
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {this.loading
                ? Array.from({ length: Math.min(this.paginate ? this.pageSize : 5, 8) }, (_, r) => (
                    <tr key={`sk-${r}`} class="skeleton-row" aria-hidden="true">
                      {Array.from({ length: colCount }, (_c, i) => (
                        <td key={i}>
                          <ui-skeleton width={i % 2 ? '55%' : '80%'} />
                        </td>
                      ))}
                    </tr>
                  ))
                : visible.length === 0
                ? (
                    <tr>
                      <td class="empty" colSpan={Math.max(colCount, 1)}>
                        <slot name="empty">{this.emptyText}</slot>
                      </td>
                    </tr>
                  )
                : visible.map((row, r) => {
                    const key = keys[r];
                    const isSelected = selectedSet.has(key);
                    return (
                      <tr
                        key={key}
                        class={{ selected: isSelected, clickable: this.rowClickable }}
                        aria-selected={this.selectable ? (isSelected ? 'true' : 'false') : undefined}
                        tabindex={this.rowClickable ? 0 : undefined}
                        onClick={(e) => this.onRowActivate(e, row)}
                        onKeyDown={(e) => e.key === 'Enter' && e.target === e.currentTarget && this.onRowActivate(e, row)}
                      >
                        {this.selectable && (
                          <td class="select-col">
                            <ui-checkbox
                              label={`Select row ${(page - 1) * this.pageSize + r + 1}`}
                              checked={isSelected}
                              onUiChange={(e) => {
                                e.stopPropagation();
                                this.toggleRow(key, e.detail);
                              }}
                            />
                          </td>
                        )}
                        {this.columns.map((c) => (
                          <td key={c.key} class={`align-${c.align ?? 'start'}`}>
                            {/* Put your own markup in a slot named "cell:<rowKey>:<columnKey>". */}
                            <slot name={`cell:${key}:${c.key}`}>{this.cellText(row, c)}</slot>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>

        {this.paginate && (
          <div class="footer">
            <span class="summary" aria-live="polite">
              {total === 0 ? 'No rows' : `Showing ${from}\u2013${to} of ${total}`}
            </span>
            <div class="footer-controls">
              {this.pageSizeOptions.length > 1 && (
                <label class="size">
                  <span>Rows per page</span>
                  <select class="size-select" onChange={(e) => this.setPageSize(Number((e.target as HTMLSelectElement).value))}>
                    {this.pageSizeOptions.map((n) => (
                      <option key={n} value={n} selected={n === this.pageSize}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <ui-pagination
                size="sm"
                page={page}
                pageCount={pageCount}
                label="Table pagination"
                onUiChange={(e) => {
                  e.stopPropagation();
                  this.setPage(e.detail);
                }}
              />
            </div>
          </div>
        )}
      </Host>
    );
  }
}
