import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getScrollStackItemId,
  resolveScrollStackActiveState,
  getNextScrollStackIndex,
} from '../packages/reactbits-navigation/index.js';

test('getScrollStackItemId generates stable identifiers', () => {
  assert.equal(getScrollStackItemId({ id: 'custom' }, 0), 'custom');
  assert.equal(getScrollStackItemId({ href: '/demo' }, 1), '/demo');
  assert.equal(getScrollStackItemId(null, 2), 'item-2');
});

test('resolveScrollStackActiveState falls back to first item when id is missing', () => {
  const items = [{ id: 'one' }, { id: 'two' }];
  const result = resolveScrollStackActiveState(items, 'missing');
  assert.equal(result.resolvedId, 'one');
  assert.equal(result.index, 0);
});

test('resolveScrollStackActiveState honours defaultActiveId', () => {
  const items = [{ id: 'one' }, { id: 'two' }];
  const result = resolveScrollStackActiveState(items, undefined, 'two');
  assert.equal(result.resolvedId, 'two');
  assert.equal(result.index, 1);
});

test('getNextScrollStackIndex clamps boundaries', () => {
  const items = [{ id: 'one' }, { id: 'two' }, { id: 'three' }];
  assert.equal(getNextScrollStackIndex(items, 1, 1), 2);
  assert.equal(getNextScrollStackIndex(items, 2, 1), 2);
  assert.equal(getNextScrollStackIndex(items, 0, -1), 0);
});
