// Queue behaviour of confirm()/prompt(). The host component's queue is pure logic, so we model it here
// and test the contract the component must keep. Run: node --test test/dialogs.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';

/** Same queue discipline as ui-dialog-host: one dialog at a time, FIFO, every promise settles exactly once. */
function makeQueue() {
  const queue = []; let current;
  const shown = [];
  const next = () => {
    const item = queue.shift();
    current = item;
    if (item) shown.push(item.req.title);
  };
  return {
    open(req) {
      return new Promise((resolve) => {
        queue.push({ req, resolve });
        if (!current) next();
      });
    },
    finish(result) {
      if (!current) return;
      const item = current; current = undefined;
      item.resolve(result);
      next();
    },
    get current() { return current?.req.title; },
    get pending() { return queue.length; },
    shown,
  };
}

test('two requests at once: the second waits, then shows, in order', async () => {
  const q = makeQueue();
  const a = q.open({ title: 'A', kind: 'confirm' });
  const b = q.open({ title: 'B', kind: 'confirm' });
  assert.equal(q.current, 'A'); assert.equal(q.pending, 1);
  q.finish(true);
  assert.equal(await a, true);
  assert.equal(q.current, 'B');
  q.finish(false);
  assert.equal(await b, false);
  assert.deepEqual(q.shown, ['A', 'B']);
});

test('every promise resolves exactly once, even if finish is called twice', async () => {
  const q = makeQueue();
  let resolutions = 0;
  const p = q.open({ title: 'X', kind: 'confirm' }).then(() => resolutions++);
  q.finish(true); q.finish(true); q.finish(true);
  await p;
  assert.equal(resolutions, 1);
});

test('closing with Escape (cancel) resolves confirm as false and prompt as null', async () => {
  const q = makeQueue();
  const c = q.open({ title: 'C', kind: 'confirm' });
  q.finish(false);
  assert.equal(await c, false);
  const p = q.open({ title: 'P', kind: 'prompt' });
  q.finish(null);
  assert.equal(await p, null);
});

test('a burst of many requests all settle, in order', async () => {
  const q = makeQueue();
  const ps = Array.from({ length: 25 }, (_, i) => q.open({ title: `#${i}`, kind: 'confirm' }));
  for (let i = 0; i < 25; i++) q.finish(i % 2 === 0);
  const results = await Promise.all(ps);
  assert.deepEqual(results, Array.from({ length: 25 }, (_, i) => i % 2 === 0));
  assert.equal(q.pending, 0);
  assert.equal(q.current, undefined);
});
