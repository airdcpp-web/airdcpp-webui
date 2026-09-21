import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import {
  loadLocalProperty,
  saveLocalProperty,
  removeLocalProperty,
  loadSessionProperty,
  saveSessionProperty,
  removeSessionProperty,
  hasTouchSupport,
  usingMobileLayout,
  preventMouseFocus,
} from '../BrowserUtils';

const storageAvailable = typeof localStorage !== 'undefined' && typeof sessionStorage !== 'undefined';

if (storageAvailable) {
  describe('BrowserUtils', () => {
    beforeEach(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

  describe('localProperty', () => {
    test('should save and load a value', () => {
      saveLocalProperty('test-key', { foo: 'bar' });
      expect(loadLocalProperty('test-key')).toEqual({ foo: 'bar' });
    });

    test('should return default when key not found', () => {
      expect(loadLocalProperty('nonexistent', 'default')).toBe('default');
    });

    test('should return undefined when no key and no default', () => {
      expect(loadLocalProperty('nonexistent')).toBeUndefined();
    });

    test('should return undefined when key is undefined', () => {
      expect(loadLocalProperty(undefined, 'default')).toBe('default');
    });

    test('should handle false boolean values', () => {
      saveLocalProperty('bool-key', false);
      expect(loadLocalProperty('bool-key', true)).toBe(false);
    });

    test('should handle numeric values', () => {
      saveLocalProperty('num-key', 42);
      expect(loadLocalProperty('num-key')).toBe(42);
    });

    test('should remove a value', () => {
      saveLocalProperty('remove-key', 'test');
      removeLocalProperty('remove-key');
      expect(loadLocalProperty('remove-key')).toBeUndefined();
    });
  });

  describe('sessionProperty', () => {
    test('should save and load a value', () => {
      saveSessionProperty('test-key', 'value');
      expect(loadSessionProperty('test-key')).toBe('value');
    });

    test('should be isolated from localStorage', () => {
      saveSessionProperty('same-key', 'session');
      saveLocalProperty('same-key', 'local');
      expect(loadSessionProperty('same-key')).toBe('session');
      expect(loadLocalProperty('same-key')).toBe('local');
    });

    test('should remove a value', () => {
      saveSessionProperty('remove-key', 'test');
      removeSessionProperty('remove-key');
      expect(loadSessionProperty('remove-key')).toBeUndefined();
    });
  });

  describe('hasTouchSupport', () => {
    test('should return false in test environment', () => {
      expect(hasTouchSupport()).toBe(false);
    });
  });

  describe('usingMobileLayout', () => {
    test('should return true for small width', () => {
      expect(usingMobileLayout(699)).toBe(true);
    });

    test('should return false for large width', () => {
      expect(usingMobileLayout(1024)).toBe(false);
    });

    test('should handle null width', () => {
      expect(typeof usingMobileLayout(null)).toBe('boolean');
    });
  });

  describe('preventMouseFocus', () => {
    test('should prevent default on left click', () => {
      const e = { button: 0, preventDefault: vi.fn() } as any;
      preventMouseFocus(e);
      expect(e.preventDefault).toHaveBeenCalled();
    });

    test('should not prevent default on right click', () => {
      const e = { button: 2, preventDefault: vi.fn() } as any;
      preventMouseFocus(e);
      expect(e.preventDefault).not.toHaveBeenCalled();
    });
  });
});
}
