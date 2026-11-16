# Lists, boards and scheduling

## Sortable list

```js
sortable.items = [{ id: 'a', label: 'Design' }, { id: 'b', label: 'Build' }];
sortable.addEventListener('ui-reorder', (e) => save(e.detail));
```

- Drag with a pointer, or focus an item and press Alt with the up or down arrow.
- The keyboard path is the one to test. It's the same for screen-reader users.

## Kanban board

```js
board.columns = [{ id: 'todo', title: 'To do' }, { id: 'doing', title: 'In progress' }, { id: 'done', title: 'Done' }];
board.cards = [{ id: '1', title: 'Write docs', detail: 'Owner: Ada' }];
board.layout = { todo: ['1'], doing: [], done: [] };
board.addEventListener('ui-move', (e) => save(e.detail.layout));
```

- Drag cards between columns, or focus a card and use Alt with the arrow keys:
  - Alt + Up or Down reorders within a column.
  - Alt + Left or Right moves the card to the neighbouring column.
- `layout` maps each column id to its ordered card ids. Keep it in your state; the board emits every change.

## Scheduler

```js
scheduler.events = [
  { id: 'e1', title: 'Design review', start: '2026-11-16', startTime: '10:00', endTime: '11:00' },
  { id: 'e2', title: 'Conference', start: '2026-11-18', end: '2026-11-20' },
];
scheduler.view = 'week';
scheduler.addEventListener('ui-event-click', (e) => open(e.detail));
```

- `view`: `month` or `week`.
- Events without `startTime` are all-day. Multi-day events show on each day they cover.
- In week view, overlapping timed events sit side by side.
- Use `date` to choose the week or month shown, `first-day-of-week` (0 Sunday, 1 Monday), and `day-start` / `day-end` for the visible hours.
- Each event is a real button, so keyboard and screen-reader users reach every event.
