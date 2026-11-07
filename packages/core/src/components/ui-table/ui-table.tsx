import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import type { TableColumn, TableRow } from '../../types';

@Component({
  tag: 'ui-table',
  styleUrl: 'ui-table.css',
  shadow: true,
})
export class UiTable {
  @Prop() columns: TableColumn[] = [];
  @Prop() rows: TableRow[] = [];
  @Prop() rowKey = 'id';
  @Prop() caption?: string;
  @Prop() emptyText = 'No data to display';
  @Prop() selectable = false;
  @Prop({ mutable: true }) selected: string[] = [];

  @State() sortKey = '';
  @State() sortDirection: 'ascending' | 'descending' = 'ascending';

  @Event() uiSort!: EventEmitter<{ key: string; direction: 'ascending' | 'descending' }>;
  @Event() uiSelectionChange!: EventEmitter<string[]>;

  private keyOf(row: TableRow, index: number): string {
    return String(row[this.rowKey] ?? index);
  }

  private visibleRows(): Array<{ row: TableRow; index: number }> {
    const indexed = this.rows.map((row, index) => ({ row, index }));
    if (!this.sortKey) return indexed;
    const direction = this.sortDirection === 'ascending' ? 1 : -1;
    return indexed.sort((a, b) => {
      const left = a.row[this.sortKey];
      const right = b.row[this.sortKey];
      if (typeof left === 'number' && typeof right === 'number') return (left - right) * direction;
      return String(left ?? '').localeCompare(String(right ?? ''), undefined, { numeric: true, sensitivity: 'base' }) * direction;
    });
  }

  private sort(column: TableColumn) {
    if (!column.sortable) return;
    const direction = this.sortKey === column.key && this.sortDirection === 'ascending' ? 'descending' : 'ascending';
    this.sortKey = column.key;
    this.sortDirection = direction;
    this.uiSort.emit({ key: column.key, direction });
  }

  private toggleRow(key: string, checked: boolean) {
    const next = checked ? [...new Set([...this.selected, key])] : this.selected.filter((item) => item !== key);
    this.selected = next;
    this.uiSelectionChange.emit(next);
  }

  private toggleAll(checked: boolean) {
    const visibleKeys = this.visibleRows().map(({ row, index }) => this.keyOf(row, index));
    const visibleSet = new Set(visibleKeys);
    const next = checked ? [...new Set([...this.selected, ...visibleKeys])] : this.selected.filter((key) => !visibleSet.has(key));
    this.selected = next;
    this.uiSelectionChange.emit(next);
  }

  private display(value: unknown): string {
    if (value == null) return '';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return String(value);
  }

  render() {
    const rows = this.visibleRows();
    const keys = rows.map(({ row, index }) => this.keyOf(row, index));
    const allSelected = keys.length > 0 && keys.every((key) => this.selected.includes(key));
    const someSelected = keys.some((key) => this.selected.includes(key));

    return (
      <Host>
        <div class="viewport" role="region" aria-label={this.caption || 'Data table'} tabindex="0">
          <table>
            {this.caption && <caption>{this.caption}</caption>}
            <thead>
              <tr>
                {this.selectable && (
                  <th class="selection" scope="col">
                    <input type="checkbox" aria-label="Select all rows" checked={allSelected} indeterminate={!allSelected && someSelected} onChange={(event) => this.toggleAll((event.target as HTMLInputElement).checked)} />
                  </th>
                )}
                {this.columns.map((column) => (
                  <th scope="col" aria-sort={this.sortKey === column.key ? this.sortDirection : 'none'} class={`align-${column.align ?? 'start'}`} key={column.key}>
                    {column.sortable ? (
                      <button type="button" class="sort" onClick={() => this.sort(column)}>
                        {column.label}
                        <span aria-hidden="true">{this.sortKey === column.key ? (this.sortDirection === 'ascending' ? ' ▲' : ' ▼') : ' ↕'}</span>
                      </button>
                    ) : column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length ? rows.map(({ row, index }) => {
                const key = this.keyOf(row, index);
                return (
                  <tr key={key} aria-selected={this.selectable ? String(this.selected.includes(key)) : undefined}>
                    {this.selectable && <td class="selection"><input type="checkbox" aria-label={`Select row ${key}`} checked={this.selected.includes(key)} onChange={(event) => this.toggleRow(key, (event.target as HTMLInputElement).checked)} /></td>}
                    {this.columns.map((column) => <td class={`align-${column.align ?? 'start'}`} key={column.key}>{this.display(row[column.key])}</td>)}
                  </tr>
                );
              }) : (
                <tr><td class="empty" colSpan={Math.max(1, this.columns.length + (this.selectable ? 1 : 0))}>{this.emptyText}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Host>
    );
  }
}