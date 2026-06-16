import { describe, expect, test } from 'vitest';
import { merge } from '../merge';

describe('deep merge', () => {
  test('should merge flat objects', () => {
    expect(merge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
  });

  test('should deep merge nested objects', () => {
    expect(merge({ a: { b: 1 } }, { a: { c: 2 } })).toEqual({ a: { b: 1, c: 2 } });
  });

  test('should override values', () => {
    expect(merge({ a: 1 }, { a: 2 })).toEqual({ a: 2 });
  });

  test('should not mutate original', () => {
    const a = { x: { y: 1 } };
    const b = { x: { z: 2 } };
    merge(a, b);
    expect(a).toEqual({ x: { y: 1 } });
  });

  test('should handle multiple sources', () => {
    expect(merge({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 });
  });

  test('should handle empty sources', () => {
    expect(merge({ a: 1 })).toEqual({ a: 1 });
  });

  test('should merge arrays by replacement', () => {
    expect(merge({ a: [1, 2] }, { a: [3, 4] })).toEqual({ a: [3, 4] });
  });

  test('should handle deep nested merge at 3 levels', () => {
    expect(merge({ a: { b: { c: 1 } } }, { a: { b: { d: 2 } } })).toEqual({
      a: { b: { c: 1, d: 2 } },
    });
  });

  test('should override nested primitive', () => {
    expect(merge({ a: { b: 1 } }, { a: { b: 2 } })).toEqual({ a: { b: 2 } });
  });
});
