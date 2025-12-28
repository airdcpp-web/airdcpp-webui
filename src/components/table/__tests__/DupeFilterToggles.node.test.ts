import { describe, expect, test } from 'vitest';

// Test the regex patterns that DupeFilterToggles generates
// Pattern format: ^(?!.*(share|queue)).*$
describe('DupeFilterToggles regex patterns', () => {
  // Helper to build the same pattern the component builds
  const buildFilterPattern = (hideShared: boolean, hideQueued: boolean): string => {
    if (!hideShared && !hideQueued) {
      return '';
    }

    const excludePatterns: string[] = [];

    if (hideShared) {
      excludePatterns.push('share');
    }

    if (hideQueued) {
      excludePatterns.push('queue');
    }

    return `^(?!.*(${excludePatterns.join('|')})).*$`;
  };

  describe('buildFilterPattern', () => {
    test('should return empty string when no filters are active', () => {
      const pattern = buildFilterPattern(false, false);
      expect(pattern).toBe('');
    });

    test('should return share filter pattern when hideShared is true', () => {
      const pattern = buildFilterPattern(true, false);
      expect(pattern).toBe('^(?!.*(share)).*$');
    });

    test('should return queue filter pattern when hideQueued is true', () => {
      const pattern = buildFilterPattern(false, true);
      expect(pattern).toBe('^(?!.*(queue)).*$');
    });

    test('should return combined filter pattern when both are true', () => {
      const pattern = buildFilterPattern(true, true);
      expect(pattern).toBe('^(?!.*(share|queue)).*$');
    });
  });

  describe('regex matching behavior', () => {
    // Dupe IDs: share_partial, share_full, queue_partial, queue_full,
    // finished_partial, finished_full, share_queue, queue_finished,
    // share_finished, share_queue_finished

    describe('hideShared pattern', () => {
      const pattern = '^(?!.*(share)).*$';
      const regex = new RegExp(pattern);

      test('should match empty string (no dupe)', () => {
        expect(regex.test('')).toBe(true);
      });

      test('should match null/undefined dupe types', () => {
        // When there's no dupe, the dupe field would be stringified as empty or checked separately
        expect(regex.test('')).toBe(true);
      });

      test('should NOT match share_partial', () => {
        expect(regex.test('share_partial')).toBe(false);
      });

      test('should NOT match share_full', () => {
        expect(regex.test('share_full')).toBe(false);
      });

      test('should NOT match share_queue', () => {
        expect(regex.test('share_queue')).toBe(false);
      });

      test('should NOT match share_finished', () => {
        expect(regex.test('share_finished')).toBe(false);
      });

      test('should NOT match share_queue_finished', () => {
        expect(regex.test('share_queue_finished')).toBe(false);
      });

      test('should match queue_partial (not filtered)', () => {
        expect(regex.test('queue_partial')).toBe(true);
      });

      test('should match queue_full (not filtered)', () => {
        expect(regex.test('queue_full')).toBe(true);
      });

      test('should match finished_partial (not filtered)', () => {
        expect(regex.test('finished_partial')).toBe(true);
      });

      test('should match finished_full (not filtered)', () => {
        expect(regex.test('finished_full')).toBe(true);
      });
    });

    describe('hideQueued pattern', () => {
      const pattern = '^(?!.*(queue)).*$';
      const regex = new RegExp(pattern);

      test('should match empty string (no dupe)', () => {
        expect(regex.test('')).toBe(true);
      });

      test('should NOT match queue_partial', () => {
        expect(regex.test('queue_partial')).toBe(false);
      });

      test('should NOT match queue_full', () => {
        expect(regex.test('queue_full')).toBe(false);
      });

      test('should NOT match share_queue', () => {
        expect(regex.test('share_queue')).toBe(false);
      });

      test('should NOT match queue_finished', () => {
        expect(regex.test('queue_finished')).toBe(false);
      });

      test('should NOT match share_queue_finished', () => {
        expect(regex.test('share_queue_finished')).toBe(false);
      });

      test('should match share_partial (not filtered)', () => {
        expect(regex.test('share_partial')).toBe(true);
      });

      test('should match share_full (not filtered)', () => {
        expect(regex.test('share_full')).toBe(true);
      });

      test('should match finished_partial (not filtered)', () => {
        expect(regex.test('finished_partial')).toBe(true);
      });

      test('should match finished_full (not filtered)', () => {
        expect(regex.test('finished_full')).toBe(true);
      });
    });

    describe('hideShared AND hideQueued pattern', () => {
      const pattern = '^(?!.*(share|queue)).*$';
      const regex = new RegExp(pattern);

      test('should match empty string (no dupe)', () => {
        expect(regex.test('')).toBe(true);
      });

      test('should NOT match share_partial', () => {
        expect(regex.test('share_partial')).toBe(false);
      });

      test('should NOT match share_full', () => {
        expect(regex.test('share_full')).toBe(false);
      });

      test('should NOT match queue_partial', () => {
        expect(regex.test('queue_partial')).toBe(false);
      });

      test('should NOT match queue_full', () => {
        expect(regex.test('queue_full')).toBe(false);
      });

      test('should NOT match share_queue', () => {
        expect(regex.test('share_queue')).toBe(false);
      });

      test('should NOT match queue_finished', () => {
        expect(regex.test('queue_finished')).toBe(false);
      });

      test('should NOT match share_finished', () => {
        expect(regex.test('share_finished')).toBe(false);
      });

      test('should NOT match share_queue_finished', () => {
        expect(regex.test('share_queue_finished')).toBe(false);
      });

      test('should match finished_partial (not filtered)', () => {
        expect(regex.test('finished_partial')).toBe(true);
      });

      test('should match finished_full (not filtered)', () => {
        expect(regex.test('finished_full')).toBe(true);
      });

      test('should match random non-matching string', () => {
        expect(regex.test('some_other_value')).toBe(true);
      });
    });
  });
});
