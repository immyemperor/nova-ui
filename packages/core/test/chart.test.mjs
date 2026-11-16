// Chart maths tests. Run: node --test test/chart.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadModule } from './load.mjs';
const C = loadModule('utils/chart.ts');

test('linearScale maps the domain ends to the range ends', () => {
  const s = C.linearScale([0, 10], [100, 0]);
  assert.equal(s(0), 100); assert.equal(s(10), 0); assert.equal(s(5), 50);
});

test('linearScale puts a zero-width domain in the middle of the range', () => {
  assert.equal(C.linearScale([5, 5], [0, 100])(5), 50);
});

test('niceTicks covers the data with round steps', () => {
  assert.deepEqual(C.niceTicks(0, 100, 5), [0, 25, 50, 75, 100]);
  const t = C.niceTicks(3, 97, 5);
  assert.ok(t[0] <= 3 && t[t.length - 1] >= 97, `covers 3..97: ${t}`);
  assert.ok(t.every((v) => Math.round(v * 1000) === v * 1000 || Number.isInteger(v)), 'no float noise');
});

test('niceTicks handles a flat series and empty input', () => {
  const t = C.niceTicks(7, 7, 5);
  assert.ok(t.length >= 2 && t[0] <= 6 && t[t.length - 1] >= 8);
  assert.deepEqual(C.niceTicks(NaN, 10), []);
});

test('niceTicks steps are 1, 2, 2.5, 5 or 10 times a power of ten', () => {
  for (const [a, b] of [[0, 1], [0, 37], [120, 980], [0.001, 0.09], [-50, 60]]) {
    const t = C.niceTicks(a, b, 6);
    const step = t[1] - t[0];
    const mag = Math.pow(10, Math.floor(Math.log10(step)));
    const m = Number((step / mag).toFixed(6));
    assert.ok([1, 2, 2.5, 5, 10].includes(m), `step ${step} (mantissa ${m}) for ${a}..${b}`);
  }
});

test('extent ignores NaN and handles empty input', () => {
  assert.deepEqual(C.extent([3, NaN, -1, 7]), [-1, 7]);
  assert.deepEqual(C.extent([]), [0, 1]);
});

test('linePoints spaces points evenly and inverts y (higher value = smaller y)', () => {
  const p = C.linePoints([0, 10, 5], 200, 100, 0, [0, 10]);
  assert.equal(p.length, 3);
  assert.equal(p[0].x, 0); assert.equal(p[2].x, 200);
  assert.equal(p[0].y, 100); assert.equal(p[1].y, 0); assert.equal(p[2].y, 50);
});

test('linePath and areaPath produce valid move/line/close commands', () => {
  const pts = [{ x: 0, y: 10 }, { x: 10, y: 0 }];
  assert.equal(C.linePath(pts), 'M0 10 L10 0');
  assert.equal(C.areaPath(pts, 20), 'M0 10 L10 0 L10 20 L0 20 Z');
  assert.equal(C.areaPath([], 20), '');
});

test('bars grow from the zero baseline and keep their order', () => {
  const b = C.bars([4, -2, 8], 300, 100, 0, 0.2, [-2, 8]);
  assert.equal(b.length, 3);
  assert.ok(b[0].height > 0 && b[1].height > 0 && b[2].height > 0);
  assert.ok(b[2].height > b[0].height, 'bigger value, taller bar');
  assert.ok(b[0].x < b[1].x && b[1].x < b[2].x, 'left to right');
  const base = C.linearScale([-2, 8], [100, 0])(0);
  assert.ok(Math.abs(b[1].y - base) < 1e-9 || b[1].y <= base, 'negative bar hangs from zero');
});

test('donutSlices sum to a full circle and skip zero or negative values', () => {
  const s = C.donutSlices([1, 0, 3, -5], 50, 50, 40, 20);
  assert.equal(s.length, 2);
  assert.ok(Math.abs(s[0].fraction - 0.25) < 1e-9);
  assert.ok(Math.abs(s[1].fraction - 0.75) < 1e-9);
  assert.ok(Math.abs((s[1].end - s[0].start) - Math.PI * 2) < 1e-9, 'covers 360 degrees');
});

test('a single slice does not produce a degenerate arc', () => {
  const s = C.donutSlices([5], 50, 50, 40, 20);
  assert.equal(s.length, 1);
  assert.ok(s[0].end - s[0].start < Math.PI * 2, 'capped just under a full turn');
  assert.ok(s[0].path.startsWith('M') && s[0].path.endsWith('Z'));
});

test('donutSlices returns nothing when every value is zero', () => {
  assert.deepEqual(C.donutSlices([0, 0], 50, 50, 40, 20), []);
});

test('compact formats large numbers', () => {
  assert.equal(C.compact(950), '950');
  assert.equal(C.compact(1200), '1.2k');
  assert.equal(C.compact(15000), '15k');
  assert.equal(C.compact(3400000), '3.4M');
  assert.equal(C.compact(-2500), '-2.5k');
});
