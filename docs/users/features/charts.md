# Charts

Charts are drawn in SVG. Each one has a text summary and a data table for screen-reader users, so the numbers are never only visual.

## Line, area, bar and donut

```html
<ui-chart type="line" label="Signups"></ui-chart>
```

Arrays and objects (`labels`, `series`) are properties, so set them in code, never as attributes:

```js
chart.type = 'line';
chart.labels = ['Jan', 'Feb', 'Mar'];
chart.series = [{ name: 'Signups', values: [12, 18, 15] }];
```

A richer example:

```js
chart.type = 'area';
chart.labels = ['Jan', 'Feb', 'Mar', 'Apr'];
chart.series = [
  { name: 'Revenue', values: [12, 18, 15, 22] },
  { name: 'Target', values: [14, 14, 14, 14], color: 'var(--kvui-color-fg-muted)' },
];
```

| `type` | Shows | Notes |
| --- | --- | --- |
| `line` | One or more series as lines | Points carry tooltips |
| `area` | Lines with a filled area | Good for totals |
| `bar` | Grouped bars | Zero baseline; negatives hang below |
| `donut` | Shares of a whole | Uses the first series; labels name the slices |

Options: `height`, `axes` (gridlines and values), `show-table` (opens the data table), `compact` (1.2k, 3.4M).

Colours come from theme tokens. A series can set its own `color`.

## Sparkline

```html
<ui-sparkline label="Revenue, last 8 weeks" area></ui-sparkline>
```

```js
sparkline.values = [12, 18, 15, 22, 27, 25, 31, 38];
```

Sparklines are small trend lines for tables and cards. The label should say the direction and the period, because the line alone is ambiguous. The description reads "trending up", "down" or "flat".

## Maths helpers

`linearScale`, `niceTicks`, `extent`, `compact`, `linePath`, `areaPath`, `bars` and `donutSlices` are exported from `@kvui/core`. Use them when you draw your own SVG and want the same scales.
