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
    test.each([
      [false, false, ''],
      [true, false, '^(?!.*(share)).*$'],
      [false, true, '^(?!.*(queue)).*$'],
      [true, true, '^(?!.*(share|queue)).*$'],
    ])('hideShared=%s, hideQueued=%s returns %s', (hideShared, hideQueued, expected) => {
      expect(buildFilterPattern(hideShared, hideQueued)).toBe(expected);
    });
  });

  describe('regex matching behavior', () => {
    // Dupe IDs: share_partial, share_full, queue_partial, queue_full,
    // finished_partial, finished_full, share_queue, queue_finished,
    // share_finished, share_queue_finished

    describe('hideShared pattern', () => {
      const regex = new RegExp('^(?!.*(share)).*$');

      test.each([
        ['', true, 'empty string (no dupe)'],
        ['queue_partial', true, 'queue_partial (not filtered)'],
        ['queue_full', true, 'queue_full (not filtered)'],
        ['finished_partial', true, 'finished_partial (not filtered)'],
        ['finished_full', true, 'finished_full (not filtered)'],
        ['share_partial', false, 'share_partial'],
        ['share_full', false, 'share_full'],
        ['share_queue', false, 'share_queue'],
        ['share_finished', false, 'share_finished'],
        ['share_queue_finished', false, 'share_queue_finished'],
      ])('%s should %s match (%s)', (input, shouldMatch) => {
        expect(regex.test(input)).toBe(shouldMatch);
      });
    });

    describe('hideQueued pattern', () => {
      const regex = new RegExp('^(?!.*(queue)).*$');

      test.each([
        ['', true, 'empty string (no dupe)'],
        ['share_partial', true, 'share_partial (not filtered)'],
        ['share_full', true, 'share_full (not filtered)'],
        ['finished_partial', true, 'finished_partial (not filtered)'],
        ['finished_full', true, 'finished_full (not filtered)'],
        ['queue_partial', false, 'queue_partial'],
        ['queue_full', false, 'queue_full'],
        ['share_queue', false, 'share_queue'],
        ['queue_finished', false, 'queue_finished'],
        ['share_queue_finished', false, 'share_queue_finished'],
      ])('%s should %s match (%s)', (input, shouldMatch) => {
        expect(regex.test(input)).toBe(shouldMatch);
      });
    });

    describe('hideShared AND hideQueued pattern', () => {
      const regex = new RegExp('^(?!.*(share|queue)).*$');

      test.each([
        ['', true, 'empty string (no dupe)'],
        ['finished_partial', true, 'finished_partial (not filtered)'],
        ['finished_full', true, 'finished_full (not filtered)'],
        ['some_other_value', true, 'random non-matching string'],
        ['share_partial', false, 'share_partial'],
        ['share_full', false, 'share_full'],
        ['queue_partial', false, 'queue_partial'],
        ['queue_full', false, 'queue_full'],
        ['share_queue', false, 'share_queue'],
        ['queue_finished', false, 'queue_finished'],
        ['share_finished', false, 'share_finished'],
        ['share_queue_finished', false, 'share_queue_finished'],
      ])('%s should %s match (%s)', (input, shouldMatch) => {
        expect(regex.test(input)).toBe(shouldMatch);
      });
    });
  });
});
