// Tests for time-of-day rules. Run: node --test test/time.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadModule } from './load.mjs';
const T = loadModule('utils/time.ts');

test('parseTime accepts valid HH:mm and rejects everything else', () => {
  assert.deepEqual(T.parseTime('09:05'), { h: 9, m: 5 });
  assert.deepEqual(T.parseTime('23:59'), { h: 23, m: 59 });
  assert.equal(T.parseTime('24:00'), undefined);
  assert.equal(T.parseTime('9:05'), undefined, 'needs two digits');
  assert.equal(T.parseTime('12:60'), undefined);
  assert.equal(T.parseTime(''), undefined);
});

test('minutes round-trip and wrap past midnight', () => {
  assert.equal(T.toMinutes('01:30'), 90);
  assert.equal(T.fromMinutes(90), '01:30');
  assert.equal(T.fromMinutes(1440 + 30), '00:30', 'wraps past 24h');
  assert.equal(T.fromMinutes(-30), '23:30', 'wraps before midnight');
});

test('inTimeRange is inclusive and treats missing bounds as open', () => {
  assert.equal(T.inTimeRange('09:00', '09:00', '17:00'), true);
  assert.equal(T.inTimeRange('17:00', '09:00', '17:00'), true);
  assert.equal(T.inTimeRange('17:01', '09:00', '17:00'), false);
  assert.equal(T.inTimeRange('03:00'), true);
  assert.equal(T.inTimeRange('bogus', '09:00'), false);
});

test('timeSlots builds the list at the requested step within bounds', () => {
  assert.deepEqual(T.timeSlots('09:00', '10:00', 30), ['09:00', '09:30', '10:00']);
  assert.equal(T.timeSlots('00:00', '23:59', 60).length, 24);
});

test('durationMinutes handles overnight spans', () => {
  assert.equal(T.durationMinutes('09:00', '17:30'), 510);
  assert.equal(T.durationMinutes('22:00', '02:00'), 240, 'crosses midnight');
  assert.equal(T.durationMinutes('10:00', '10:00'), 0);
  assert.equal(T.durationMinutes('x', '10:00'), undefined);
});

test('displayTime is 12-hour text in the requested locale', () => {
  assert.match(T.displayTime('14:05', 'en-US'), /2:05\s?PM/);
  assert.equal(T.displayTime('bogus'), '');
});
