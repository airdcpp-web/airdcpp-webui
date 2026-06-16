import { describe, expect, test } from 'vitest';

describe('checkSplice (slice replacement)', () => {
  const checkSplice = <T>(messages: T[] | undefined, maxCount: number): T[] | undefined => {
    if (messages) {
      const toRemove = messages.length - maxCount;
      if (toRemove > 0) {
        return messages.slice(toRemove);
      }
    }
    return messages;
  };

  test('should remove oldest messages when exceeding max', () => {
    const messages = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
    const result = checkSplice(messages, 3);
    expect(result).toEqual([{ id: 3 }, { id: 4 }, { id: 5 }]);
  });

  test('should not modify when under max', () => {
    const messages = [{ id: 1 }, { id: 2 }];
    const result = checkSplice(messages, 5);
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  test('should return undefined for undefined input', () => {
    expect(checkSplice(undefined, 5)).toBeUndefined();
  });

  test('should return original when exactly at max', () => {
    const messages = [{ id: 1 }, { id: 2 }];
    const result = checkSplice(messages, 2);
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  test('should not mutate original array', () => {
    const messages = [{ id: 1 }, { id: 2 }, { id: 3 }];
    checkSplice(messages, 2);
    expect(messages).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  test('should return empty array when removing all', () => {
    const messages = [{ id: 1 }];
    const result = checkSplice(messages, 0);
    expect(result).toEqual([]);
  });
});

describe('updateMultiselectValues (filter replacement)', () => {
  const updateMultiselectValues = <T>(values: T[], value: T, checked: boolean): T[] => {
    if (checked) {
      values = [...values, value];
    } else {
      const index = values.indexOf(value);
      values = values.filter((_, i) => i !== index);
    }
    return values;
  };

  test('should add value when checked', () => {
    expect(updateMultiselectValues(['a', 'b'], 'c', true)).toEqual(['a', 'b', 'c']);
  });

  test('should remove value when unchecked', () => {
    expect(updateMultiselectValues(['a', 'b', 'c'], 'b', false)).toEqual(['a', 'c']);
  });

  test('should handle removing first element', () => {
    expect(updateMultiselectValues(['a', 'b', 'c'], 'a', false)).toEqual(['b', 'c']);
  });

  test('should handle removing last element', () => {
    expect(updateMultiselectValues(['a', 'b', 'c'], 'c', false)).toEqual(['a', 'b']);
  });

  test('should not mutate original array on add', () => {
    const original = ['a', 'b'];
    updateMultiselectValues(original, 'c', true);
    expect(original).toEqual(['a', 'b']);
  });

  test('should not mutate original array on remove', () => {
    const original = ['a', 'b', 'c'];
    updateMultiselectValues(original, 'b', false);
    expect(original).toEqual(['a', 'b', 'c']);
  });

  test('should handle single element removal', () => {
    expect(updateMultiselectValues(['a'], 'a', false)).toEqual([]);
  });
});
