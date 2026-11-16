// Tests for split, virtual, reorder, calendar, presence, transition maths. Run: node --test test/layout-utils.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadModule } from './load.mjs';
const L = loadModule('utils/layout-math.ts');
const V = loadModule('utils/virtual.ts');
const R = loadModule('utils/reorder.ts');
const E = loadModule('utils/calendar-events.ts');
const P = loadModule('utils/presence.ts');

test('clampSplit keeps both panes at their minimums', () => {
  assert.equal(L.clampSplit(0.01, 1000, 200, 200), 0.2);
  assert.equal(L.clampSplit(0.99, 1000, 200, 200), 0.8);
  assert.equal(L.clampSplit(0.5, 1000, 200, 200), 0.5);
});

test('clampSplit still returns a usable value when the container is too small', () => {
  const r = L.clampSplit(0.5, 300, 200, 200);
  assert.ok(r >= 0 && r <= 1);
});

test('ratioFromDrag converts pixels to a ratio and respects minimums', () => {
  assert.equal(L.ratioFromDrag(0.5, 100, 1000, 100, 100), 0.6);
  assert.equal(L.ratioFromDrag(0.5, 900, 1000, 100, 100), 0.9);
});

test('dividerKey steps, jumps to limits, and ignores other keys', () => {
  assert.equal(L.dividerKey('ArrowRight', 0.5, 10, 1000, 100, 100), 0.51);
  assert.equal(L.dividerKey('ArrowLeft', 0.5, 10, 1000, 100, 100, true), 0.45);
  assert.equal(L.dividerKey('Home', 0.5, 10, 1000, 100, 100), 0.1);
  assert.equal(L.dividerKey('End', 0.5, 10, 1000, 100, 100), 0.9);
  assert.equal(L.dividerKey('a', 0.5, 10, 1000, 100, 100), undefined);
});

test('resizeColumn enforces min and max and rounds', () => {
  assert.equal(L.resizeColumn(100, 30), 130);
  assert.equal(L.resizeColumn(100, -500), 48);
  assert.equal(L.resizeColumn(1100, 500), 1200);
  assert.equal(L.resizeColumn(100, 0.4), 100);
});

test('virtualRange returns only the rows on screen, plus overscan', () => {
  const w = V.virtualRange(1000, 300, 30, 10000, 2);
  assert.equal(w.start, 31); // first visible row is 33, minus 2 overscan
  assert.ok(w.end - w.start <= 15 + 4 + 1, `window size ${w.end - w.start}`);
  assert.equal(w.offsetTop, w.start * 30);
  assert.equal(w.totalHeight, 300000);
});

test('virtualRange at the start and end of a list stays in bounds', () => {
  const top = V.virtualRange(0, 300, 30, 20, 3);
  assert.equal(top.start, 0);
  const bottom = V.virtualRange(100000, 300, 30, 20, 3);
  assert.equal(bottom.end, 20);
  assert.deepEqual(V.virtualRange(0, 300, 30, 0), { start: 0, end: 0, offsetTop: 0, totalHeight: 0 });
});

test('scrollToRow scrolls the minimum distance to reveal a row', () => {
  assert.equal(V.scrollToRow(0, 300, 300, 30), 0, 'above: scroll up to it');
  assert.equal(V.scrollToRow(20, 0, 300, 30), 330, 'row 20 spans 600-630px, so the offset must be 630-300');
  assert.equal(V.scrollToRow(5, 0, 300, 30), 0, 'already visible: no movement');
});

test('moveItem reorders without mutating the input', () => {
  const a = ['a', 'b', 'c', 'd'];
  assert.deepEqual(R.moveItem(a, 0, 2), ['b', 'c', 'a', 'd']);
  assert.deepEqual(a, ['a', 'b', 'c', 'd']);
  assert.deepEqual(R.moveItem(a, 3, 0), ['d', 'a', 'b', 'c']);
  assert.deepEqual(R.moveItem(a, 9, 0), a, 'out-of-range source is a no-op');
});

test('dropIndex finds the slot the pointer is above', () => {
  const mids = [10, 30, 50];
  assert.equal(R.dropIndex(mids, 5), 0);
  assert.equal(R.dropIndex(mids, 20), 1);
  assert.equal(R.dropIndex(mids, 99), 3);
});

test('keyboardMove steps one place and stops at the ends', () => {
  assert.deepEqual(R.keyboardMove(['x', 'y', 'z'], 1, -1), { list: ['y', 'x', 'z'], index: 0 });
  assert.deepEqual(R.keyboardMove(['x', 'y', 'z'], 0, -1), { list: ['x', 'y', 'z'], index: 0 });
});

test('moveCard moves between columns and keeps every card exactly once', () => {
  const cols = { todo: ['1', '2'], doing: ['3'], done: [] };
  const next = R.moveCard(cols, '2', 'done', 0);
  assert.deepEqual(next, { todo: ['1'], doing: ['3'], done: ['2'] });
  const all = Object.values(next).flat().sort();
  assert.deepEqual(all, ['1', '2', '3']);
  assert.deepEqual(R.moveCard(cols, '1', 'doing', 99).doing, ['3', '1']);
});

test('eventsOnDay includes multi-day events on every day they span', () => {
  const ev = [{ id: 'a', title: 'Conf', start: '2026-03-10', end: '2026-03-12' }, { id: 'b', title: 'Lunch', start: '2026-03-11', startTime: '12:00' }];
  assert.deepEqual(E.eventsOnDay(ev, '2026-03-11').map((e) => e.id), ['a', 'b']);
  assert.deepEqual(E.eventsOnDay(ev, '2026-03-13').map((e) => e.id), []);
});

test('overlapping timed events get separate lanes; separate events reuse lane 0', () => {
  const out = E.layoutTimed([
    { id: 'a', title: 'A', start: 'd', startTime: '09:00', endTime: '10:00' },
    { id: 'b', title: 'B', start: 'd', startTime: '09:30', endTime: '10:30' },
    { id: 'c', title: 'C', start: 'd', startTime: '11:00', endTime: '12:00' },
  ]);
  const byId = Object.fromEntries(out.map((o) => [o.id, o]));
  assert.equal(byId.a.lane, 0); assert.equal(byId.b.lane, 1);
  assert.equal(byId.a.lanes, 2, 'a and b share two lanes');
  assert.equal(byId.c.lane, 0); assert.equal(byId.c.lanes, 1, 'c stands alone');
  assert.equal(byId.a.height, 60);
});

test('layoutTimed skips all-day events and clamps to the visible day', () => {
  const out = E.layoutTimed([{ id: 'allday', title: 'x', start: 'd' }, { id: 'late', title: 'y', start: 'd', startTime: '23:00', endTime: '23:59' }], 0, 1440);
  assert.deepEqual(out.map((o) => o.id), ['late']);
});

test('weekDays returns seven dates starting on the chosen weekday', () => {
  const mon = E.weekDays('2026-11-13', 1); // a Friday
  assert.equal(mon[0], '2026-11-09'); assert.equal(mon.length, 7); assert.equal(mon[6], '2026-11-15');
  assert.equal(E.weekDays('2026-11-13', 0)[0], '2026-11-08', 'Sunday start');
});

test('nextPhase: entering, staying, exiting, then out only after the exit finishes', () => {
  assert.equal(P.nextPhase('out', true), 'in');
  assert.equal(P.nextPhase('in', false), 'exiting');
  assert.equal(P.nextPhase('exiting', false, false), 'exiting', 'still animating');
  assert.equal(P.nextPhase('exiting', false, true), 'out');
  assert.equal(P.nextPhase('exiting', true), 'in', 'reopened mid-exit');
});

test('an element stays mounted through its exit', () => {
  assert.equal(P.isMounted('in'), true);
  assert.equal(P.isMounted('exiting'), true);
  assert.equal(P.isMounted('out'), false);
});

test('withViewTransition falls back to a plain update without the API', async () => {
  const { withViewTransition } = loadModule('utils/transition.ts');
  let ran = false;
  globalThis.document = {};
  await withViewTransition(() => { ran = true; });
  delete globalThis.document;
  assert.equal(ran, true);
});

test('kanban keyboard move down: target index counts after the card is removed', () => {
  // Card A is at index 0 of [A,B,C]; moving it down one place must land it after B.
  const cols = { todo: ['A', 'B', 'C'] };
  assert.deepEqual(R.moveCard(cols, 'A', 'todo', 1).todo, ['B', 'A', 'C']);
  assert.deepEqual(R.moveCard(cols, 'A', 'todo', 2).todo, ['B', 'C', 'A']);
});
