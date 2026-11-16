# Data tables

`<ui-table>` shows rows with sorting, search, selection, pagination, export, resizing, expandable rows and virtual scrolling.

## Basic table

```html
<ui-table caption="Team" searchable selectable paginate></ui-table>
```

Set data with properties:

```js
table.columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'spend', label: 'Spend', align: 'end', sortable: true, format: (v) => `$${v.toLocaleString()}` },
];
table.rows = [{ id: 1, name: 'Ada', spend: 4200 }];
```

- `row-key` names the id field (default `id`). Selection and custom cells use it.
- `columns`: `key`, `label`, `sortable`, `align`, `width`, `format`.
- Clicking a sortable header cycles ascending, descending, off.

## Browser or server data

- **Browser mode** (default): pass every row. Search, sort and paging happen in the table.
- **Server mode**: set `manual`, pass the current page as `rows` and the full count as `total`. Handle `ui-query-change`, which carries `{ page, pageSize, sort, search }`. Search is debounced.

```tsx
<UiTable
  manual
  rows={rows}
  total={total}
  page={query.page}
  pageSize={query.pageSize}
  onUiQueryChange={(e) => setQuery(e.detail)}
/>
```

## Selection

`selectable` adds checkboxes and a select-all for the page. Selection survives page changes and is reported in `ui-selection-change`. Put actions for selected rows in `slot="bulk-actions"`.

## Custom cells

```html
<ui-table>
  <ui-badge slot="cell:u1:status" tone="success">Active</ui-badge>
</ui-table>
```

Use the slot name `cell:<rowKey>:<columnKey>`. Any markup works there.

## Expandable rows and resizing

- `expandable` adds a toggle column. Put detail content in `slot="expand:<rowKey>"`.
- `resizable` lets users drag header edges to change column widths.

## Export

`exportable` adds an Export CSV button. It exports every row that matches the current search and sort, not just the visible page. You can also call it yourself:

```js
const csv = await table.exportCSV();
```

Exported cells beginning with `=`, `+`, `-` or `@` are neutralised so spreadsheets don't run them as formulas.

## Virtual scrolling

For thousands of rows:

```html
<ui-table virtual max-height="420px" row-height="44" paginate="false"></ui-table>
```

Virtual mode needs `max-height` (the scroll area) and a fixed `row-height`. It doesn't work with expandable rows. Only rows on screen are rendered.

## Tree, virtual list

- `<ui-tree>` shows a hierarchy with expand and collapse, single selection and full keyboard support. Pass `nodes` as `{ id, label, icon?, children? }`.
- `<ui-virtual-list>` renders long lists with a `count`, a `row-height` and a `render-row` function.
