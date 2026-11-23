// Run: node --test scripts/release.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseArgs, planPublish, publishArgs } from './release.mjs';

test('parses the command and its options', () => {
  assert.deepEqual(parseArgs(['publish', '--dry-run', '--tag', 'next']), { command: 'publish', dryRun: true, tag: 'next', otp: undefined });
  assert.equal(parseArgs([]).command, 'help');
  assert.throws(() => parseArgs(['publish', '--nope']), /unknown option/);
});

test('packages already on npm are skipped, so re-running a release is safe', () => {
  const plan = planPublish(
    [{ name: '@kvui/core', version: '0.2.0', file: 'a.tgz' }, { name: '@kvui/vue', version: '0.2.0', file: 'b.tgz' }],
    (name) => name === '@kvui/core',
  );
  assert.deepEqual(plan.map((p) => p.action), ['skip', 'publish']);
});

test('publish arguments publish the tarball, publicly, with optional tag, OTP and dry run', () => {
  assert.deepEqual(publishArgs('x.tgz', { dryRun: false }), ['publish', 'x.tgz', '--access', 'public']);
  assert.deepEqual(publishArgs('x.tgz', { tag: 'next', otp: '123456', dryRun: true }),
    ['publish', 'x.tgz', '--access', 'public', '--tag', 'next', '--otp', '123456', '--dry-run']);
});
