// Sidebar logic: collapse persistence and the collapsed-item contract. Run: node --test test/sidebar.test.mjs
// The component is DOM-driven; these tests cover the rules it relies on, with a small in-memory storage.
import { test } from 'node:test';
import assert from 'node:assert/strict';

/** Mirrors ui-sidebar's componentWillLoad / toggle persistence contract. */
function makeSidebar(storage, storageKey) {
  const s = { collapsed: false, emitted: [] };
  s.load = () => {
    if (!storageKey) return;
    const saved = storage.get(storageKey);
    if (saved === '1' || saved === '0') s.collapsed = saved === '1';
  };
  s.toggle = () => {
    s.collapsed = !s.collapsed;
    if (storageKey) storage.set(storageKey, s.collapsed ? '1' : '0');
    s.emitted.push(s.collapsed);
  };
  return s;
}

test('collapsed state is restored from storage on load', () => {
  const store = new Map([['nav', '1']]);
  const s = makeSidebar(store, 'nav');
  s.load();
  assert.equal(s.collapsed, true);
});

test('toggling writes the new state back and emits it once', () => {
  const store = new Map();
  const s = makeSidebar(store, 'nav');
  s.toggle();
  assert.equal(store.get('nav'), '1');
  s.toggle();
  assert.equal(store.get('nav'), '0');
  assert.deepEqual(s.emitted, [true, false]);
});

test('a corrupt stored value is ignored and the prop default is kept', () => {
  const store = new Map([['nav', 'banana']]);
  const s = makeSidebar(store, 'nav');
  s.load();
  assert.equal(s.collapsed, false);
});

test('no storageKey means nothing is read or written', () => {
  const store = new Map();
  const s = makeSidebar(store, undefined);
  s.toggle();
  assert.equal(store.size, 0);
});
