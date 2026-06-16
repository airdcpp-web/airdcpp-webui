import { describe, expect, test } from 'vitest';
import { escapeStringRegexp, compareVersions, camelCase, upperFirst, truncate } from '../StringUtils';

describe('escapeStringRegexp', () => {
  test('should escape special regex characters', () => {
    expect(escapeStringRegexp('hello.world')).toBe('hello\\.world');
    expect(escapeStringRegexp('a+b*c')).toBe('a\\+b\\*c');
    expect(escapeStringRegexp('[test]')).toBe('\\[test\\]');
    expect(escapeStringRegexp('foo(bar)')).toBe('foo\\(bar\\)');
    expect(escapeStringRegexp('a|b')).toBe('a\\|b');
    expect(escapeStringRegexp('^start$')).toBe('\\^start\\$');
    expect(escapeStringRegexp('{1,2}')).toBe('\\{1,2\\}');
    expect(escapeStringRegexp('?question')).toBe('\\?question');
  });

  test('should return plain string unchanged', () => {
    expect(escapeStringRegexp('hello world')).toBe('hello world');
    expect(escapeStringRegexp('abc123')).toBe('abc123');
    expect(escapeStringRegexp('test')).toBe('test');
  });

  test('should handle empty string', () => {
    expect(escapeStringRegexp('')).toBe('');
  });

  test('should handle string with no special characters', () => {
    expect(escapeStringRegexp('foo bar baz')).toBe('foo bar baz');
  });
});

describe('compareVersions', () => {
  test('should return 0 for equal versions', () => {
    expect(compareVersions('1.0.0', '1.0.0')).toBe(0);
    expect(compareVersions('2.1.3', '2.1.3')).toBe(0);
  });

  test('should return positive for newer first arg', () => {
    expect(compareVersions('2.0.0', '1.0.0')).toBeGreaterThan(0);
    expect(compareVersions('1.1.0', '1.0.0')).toBeGreaterThan(0);
    expect(compareVersions('1.0.1', '1.0.0')).toBeGreaterThan(0);
  });

  test('should return negative for older first arg', () => {
    expect(compareVersions('1.0.0', '2.0.0')).toBeLessThan(0);
    expect(compareVersions('1.0.0', '1.1.0')).toBeLessThan(0);
    expect(compareVersions('1.0.0', '1.0.1')).toBeLessThan(0);
  });

  test('should handle single digit versions', () => {
    expect(compareVersions('1', '2')).toBeLessThan(0);
    expect(compareVersions('2', '1')).toBeGreaterThan(0);
    expect(compareVersions('1', '1')).toBe(0);
  });

  test('should handle different length versions', () => {
    expect(compareVersions('1.0', '1.0.0')).toBe(0);
    expect(compareVersions('1.0.1', '1.0')).toBeGreaterThan(0);
  });
});

describe('camelCase (lodash replacement)', () => {
  test('should convert kebab-case', () => {
    expect(camelCase('my-string')).toBe('myString');
  });

  test('should convert snake_case', () => {
    expect(camelCase('my_string')).toBe('myString');
  });

  test('should convert space-separated', () => {
    expect(camelCase('my string')).toBe('myString');
  });

  test('should handle single word', () => {
    expect(camelCase('test')).toBe('test');
  });

  test('should handle empty string', () => {
    expect(camelCase('')).toBe('');
  });

  test('should handle multiple separators', () => {
    expect(camelCase('my-long-string-name')).toBe('myLongStringName');
  });

  test('should handle mixed separators', () => {
    expect(camelCase('my-string_name test')).toBe('myStringNameTest');
  });
});

describe('upperFirst (lodash replacement)', () => {
  test('should capitalize first letter', () => {
    expect(upperFirst('hello')).toBe('Hello');
  });

  test('should handle already capitalized', () => {
    expect(upperFirst('Hello')).toBe('Hello');
  });

  test('should handle empty string', () => {
    expect(upperFirst('')).toBe('');
  });

  test('should handle single char', () => {
    expect(upperFirst('a')).toBe('A');
  });

  test('should not change rest of string', () => {
    expect(upperFirst('hello world')).toBe('Hello world');
  });
});

describe('truncate (lodash replacement)', () => {
  test('should truncate long string', () => {
    expect(truncate('hello world', 5)).toBe('hello...');
  });

  test('should not truncate short string', () => {
    expect(truncate('hi', 5)).toBe('hi');
  });

  test('should handle exact length', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });

  test('should handle empty string', () => {
    expect(truncate('', 5)).toBe('');
  });

  test('should handle string with trailing spaces', () => {
    expect(truncate('hello world   ', 10)).toBe('hello worl...');
  });
});
