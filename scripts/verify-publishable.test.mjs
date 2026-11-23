// Run: node --test scripts/verify-publishable.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publishProblems } from './verify-publishable.mjs';

const good = { name: '@kvui/core', version: '0.1.0', license: 'MIT', repository: { url: 'git+https://github.com/x/y.git' }, publishConfig: { access: 'public' } };
const group = ['@kvui/core'];

test('a correctly configured package has no problems', () => {
  assert.deepEqual(publishProblems(good, group), []);
});

test('a private package is reported: it would silently not ship', () => {
  assert.ok(publishProblems({ ...good, private: true }, group).some((p) => p.includes('private')));
});

test('a scoped package without public access is reported', () => {
  assert.ok(publishProblems({ ...good, publishConfig: {} }, group).some((p) => p.includes('publishConfig.access')));
});

test('a package outside the fixed group is reported', () => {
  assert.ok(publishProblems(good, []).some((p) => p.includes('fixed group')));
});

test('missing version or licence is reported', () => {
  const problems = publishProblems({ name: '@kvui/x', publishConfig: { access: 'public' } }, ['@kvui/x']);
  assert.ok(problems.some((p) => p.includes('no version')));
  assert.ok(problems.some((p) => p.includes('no license')));
});

test('a package without a repository is reported (npm provenance needs it)', () => {
  const { repository, ...noRepo } = good;
  assert.ok(publishProblems(noRepo, group).some((p) => p.includes('repository')));
});

test('a workspace: peer reference is reported (installers cannot resolve it)', () => {
  const pkg = { ...good, peerDependencies: { '@kvui/core': 'workspace:^' } };
  assert.ok(publishProblems(pkg, group).some((p) => p.includes('workspace:^')));
});
