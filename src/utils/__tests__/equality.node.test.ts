import { describe, expect, test } from 'vitest';
import { shallowEqual } from '../equality';

describe('shallowEqual', () => {
  test('should return true for identical objects', () => {
    expect(shallowEqual({ a: 1, b: 'test' }, { a: 1, b: 'test' })).toBe(true);
  });

  test('should return true for same reference', () => {
    const obj = { a: 1 };
    expect(shallowEqual(obj, obj)).toBe(true);
  });

  test('should return false for different objects', () => {
    expect(shallowEqual({ a: 1 }, { a: 2 })).toBe(false);
  });

  test('should return false for different number of keys', () => {
    expect(shallowEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  test('should return false for null or undefined', () => {
    expect(shallowEqual(null, { a: 1 })).toBe(false);
    expect(shallowEqual({ a: 1 }, null)).toBe(false);
    expect(shallowEqual(undefined, { a: 1 })).toBe(false);
  });

  test('should return true for identical arrays', () => {
    expect(shallowEqual([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  test('should return false for different arrays', () => {
    expect(shallowEqual([1, 2, 3], [1, 2, 4])).toBe(false);
  });

  test('should return false when keys match but values differ', () => {
    expect(shallowEqual({ a: { nested: true } }, { a: { nested: true } })).toBe(false);
  });
});
