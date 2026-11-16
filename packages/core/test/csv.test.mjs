// CSV export tests. Run: node --test test/csv.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadModule } from './load.mjs';
const C = loadModule('utils/csv.ts');

test('plain values are written unquoted', () => {
  assert.equal(C.escapeCell('hello'), 'hello');
  assert.equal(C.escapeCell(42), '42');
  assert.equal(C.escapeCell(null), '');
});

test('commas, quotes and newlines are quoted, with quotes doubled', () => {
  assert.equal(C.escapeCell('a,b'), '"a,b"');
  assert.equal(C.escapeCell('say "hi"'), '"say ""hi"""');
  assert.equal(C.escapeCell('line1\nline2'), '"line1\nline2"');
});

test('formula injection: leading = + - @ are neutralised with an apostrophe', () => {
  assert.equal(C.escapeCell('=HYPERLINK("http://x")'), `"'=HYPERLINK(""http://x"")"`);
  assert.equal(C.escapeCell('+1+1'), "'+1+1");
  assert.equal(C.escapeCell('@SUM(A1)'), "'@SUM(A1)");
  assert.equal(C.escapeCell('\tcmd'), "'\tcmd");
});

test('negative numbers are not treated as formulas', () => {
  assert.equal(C.escapeCell(-4.5), '-4.5');
  assert.equal(C.escapeCell('-12'), '-12');
  assert.equal(C.escapeCell('-x'), "'-x");
});

test('toCSV writes a header, rows, and uses CRLF line endings', () => {
  const out = C.toCSV(
    [{ name: 'Ada, L.', budget: 1200 }, { name: 'Grace', budget: 900 }],
    [{ key: 'name', label: 'Name' }, { key: 'budget', label: 'Budget', format: (v) => `$${v}` }],
  );
  assert.equal(out, 'Name,Budget\r\n"Ada, L.",$1200\r\nGrace,$900\r\n');
});

test('toCSV with no rows still writes the header', () => {
  assert.equal(C.toCSV([], [{ key: 'a', label: 'A' }]), 'A\r\n');
});

test('safeFilename removes path characters and adds .csv once', () => {
  assert.equal(C.safeFilename('Q3 report'), 'Q3-report.csv');
  assert.equal(C.safeFilename('../../etc/passwd'), 'etc-passwd.csv');
  assert.equal(C.safeFilename('data.CSV'), 'data.CSV');
  assert.equal(C.safeFilename('   '), 'export.csv');
  assert.equal(C.safeFilename('a:b*c?'), 'a-b-c.csv', 'trailing dashes are trimmed');
});
