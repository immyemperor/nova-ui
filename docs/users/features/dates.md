# Dates and times

Dates are plain `YYYY-MM-DD` strings, so time zones never shift them. Times are `HH:mm` (24-hour).

## Single date

```html
<ui-date-picker name="start" label="Start date" min="2026-01-01" max="2027-12-31" clearable></ui-date-picker>
```

- Type a date or pick one from the calendar.
- `min` and `max` disable days outside the range.
- Event: `ui-change` with the new `YYYY-MM-DD` string (or `""` when cleared).

## Date range

```html
<ui-date-range-picker name="period" label="Report period" presets></ui-date-range-picker>
```

- Click a start day, then an end day. Order is fixed for you, so a backwards second click still works.
- `presets` adds Last 7 days, Last 30 days, This month and This year.
- `value` is `{ start, end }`; event `ui-change` gives the same shape. Use the `today` prop in tests and server-rendered pages.

## Calendar only

`<ui-calendar>` is the month grid on its own, for inline selection. Arrow keys move by day and week, PageUp and PageDown change month, Shift with PageUp or PageDown changes year.

## Time

```html
<ui-time-picker name="start" label="Start" min="08:00" max="18:00" step="15"></ui-time-picker>
```

- Accepts `930`, `9:30` or `09:30`. Invalid or out-of-range entries show an error.
- The list suggests slots at `step` minutes.

## Helpers

The date and time maths is exported for your own code: `parseISO`, `toISO`, `addDays`, `addMonths`, `monthGrid`, `parseTime`, `durationMinutes`, `timeSlots`. Use these rather than `new Date('2026-03-01')`, which parses in UTC and can show the wrong day.

## Scheduling

Events on a calendar with month and week views are in [Lists, boards and scheduling](lists-boards-scheduling.md).
