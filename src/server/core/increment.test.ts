import { expect } from 'vitest';
import { test } from '../test';
import {
  incrementDecrement,
  incrementGet,
  incrementIncrement,
} from './increment';

test('Should increment the count', async () => {
  const count = await incrementGet();
  expect(count).toBe(0);
  const newCount = await incrementIncrement();
  expect(newCount).toBe(1);
});

test('Should decrement the count', async () => {
  const count = await incrementGet();
  expect(count).toBe(0);
  const newCount = await incrementDecrement();
  expect(newCount).toBe(-1);
});
