// Tests for the date range rules. Run: node --test test/range.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { loadModule } from './load.mjs';
const load = (rel) => loadModule(rel);
const R = load('utils/range.ts');
const D = load('utils/date.ts');

test('first click starts a range; second click completes it', () => {
  let r = R.pickDay({}, '2026-03-10');
  assert.deepEqual(r, { start: '2026-03-10', end: undefined });
  r = R.pickDay(r, '2026-03-15');
  assert.deepEqual(r, { start: '2026-03-10', end: '2026-03-15' });
});

test('a backwards second click is reordered, not rejected', () => {
  const r = R.pickDay({ start: '2026-03-15' }, '2026-03-10');
  assert.deepEqual(r, { start: '2026-03-10', end: '2026-03-15' });
});

test('clicking after a finished range starts a fresh one', () => {
  const r = R.pickDay({ start: '2026-03-10', end: '2026-03-15' }, '2026-04-01');
  assert.deepEqual(r, { start: '2026-04-01', end: undefined });
});

test('a single-day range (same start and end) is valid', () => {
  const r = R.pickDay({ start: '2026-03-10' }, '2026-03-10');
  assert.deepEqual(r, { start: '2026-03-10', end: '2026-03-10' });
  assert.equal(R.rangeLength(r), 1);
});

test('inRange is inclusive at both ends and false when incomplete', () => {
  const r = { start: '2026-03-10', end: '2026-03-15' };
  assert.equal(R.inRange(r, '2026-03-10'), true);
  assert.equal(R.inRange(r, '2026-03-15'), true);
  assert.equal(R.inRange(r, '2026-03-16'), false);
  assert.equal(R.inRange({ start: '2026-03-10' }, '2026-03-11'), false);
});

test('rangeLength counts days inclusively across a month and a leap day', () => {
  assert.equal(R.rangeLength({ start: '2026-02-27', end: '2026-03-02' }), 4);
  assert.equal(R.rangeLength({ start: '2028-02-28', end: '2028-03-01' }), 3, 'leap year');
  assert.equal(R.rangeLength({ start: '2026-01-01' }), 0);
});

test('presets are computed from an injected "today"', () => {
  const today = new Date(2026, 10, 13);
  const p = R.presetRanges(today);
  assert.deepEqual(p.last7, { start: '2026-11-07', end: '2026-11-13' });
  assert.equal(R.rangeLength(p.last7), 7);
  assert.equal(R.rangeLength(p.last30), 30);
  assert.deepEqual(p.thisMonth, { start: '2026-11-01', end: '2026-11-13' });
  assert.deepEqual(p.thisYear, { start: '2026-01-01', end: '2026-11-13' });
});

test('normaliseRange leaves a half-open range alone', () => {
  assert.deepEqual(R.normaliseRange({ start: '2026-05-01' }), { start: '2026-05-01' });
});
