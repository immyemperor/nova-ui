// Tests for upload validation rules. Run: node --test test/files.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadModule } from './load.mjs';
const F = loadModule('utils/files.ts');
const file = (name, size = 1000, type = '') => ({ name, size, type });

test('acceptsType: extensions, wildcards and exact MIME types', () => {
  assert.equal(F.acceptsType(file('a.PNG', 1, 'image/png'), 'image/*'), true);
  assert.equal(F.acceptsType(file('a.pdf', 1, 'application/pdf'), 'image/*'), false);
  assert.equal(F.acceptsType(file('report.pdf', 1, ''), '.pdf,.zip'), true, 'extension works without a MIME type');
  assert.equal(F.acceptsType(file('x', 1, 'anything'), ''), true, 'empty accept allows all');
  assert.equal(F.acceptsType(file('a.pdf', 1, 'application/pdf'), 'application/pdf'), true);
});

test('validateFiles rejects wrong type and oversize files, keeps the good ones', () => {
  const { ok, problems } = F.validateFiles(
    [file('good.png', 500, 'image/png'), file('bad.exe', 500, 'application/x-msdownload'), file('big.png', 5000, 'image/png')],
    { accept: 'image/*', maxSize: 1000 },
  );
  assert.deepEqual(ok.map((f) => f.name), ['good.png']);
  assert.deepEqual(problems.map((p) => p.reason), ['type', 'size']);
});

test('the file-count limit counts files already selected', () => {
  const { ok, problems } = F.validateFiles([file('a'), file('b'), file('c')], { maxFiles: 3 }, 2, 0);
  assert.equal(ok.length, 1, 'only one slot left');
  assert.deepEqual(problems.map((p) => p.reason), ['count', 'count']);
});

test('the total-size limit counts bytes already selected', () => {
  const { ok, problems } = F.validateFiles([file('a', 400), file('b', 400)], { maxTotalSize: 1000 }, 0, 500);
  assert.deepEqual(ok.map((f) => f.name), ['a'], 'a fits (500+400=900), b would exceed 1000');
  assert.equal(problems[0].reason, 'total');
});

test('every problem is reported at once, not just the first', () => {
  const { problems } = F.validateFiles([file('a.exe', 1), file('b.exe', 1), file('c.exe', 1)], { accept: '.pdf' });
  assert.equal(problems.length, 3);
});

test('error messages name the file and the limit', () => {
  const { problems } = F.validateFiles([file('huge.bin', 5 * 1024 * 1024, '')], { maxSize: 1024 * 1024 });
  assert.match(problems[0].message, /huge\.bin/);
  assert.match(problems[0].message, /5\.0 MB/);
  assert.match(problems[0].message, /limit is 1\.0 MB/);
});

test('formatBytes uses B, KB, MB', () => {
  assert.equal(F.formatBytes(500), '500 B');
  assert.equal(F.formatBytes(2048), '2 KB');
  assert.equal(F.formatBytes(12 * 1024 * 1024), '12 MB');
});
