import { describe, expect, test, vi, afterEach } from 'vitest';
import { createFormatter } from '../Formatter';
import i18n from 'i18next';

// Each test captures the current moment-based behavior
// These will verify that the dayjs replacement produces identical output

const mockI18n = () => {
  return {
    t: (key: string, options?: any) => options?.defaultValue || key || '',
    language: 'en',
  } as unknown as typeof i18n;
};

describe('formatRelativeTime (moment behavior snapshot)', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test('should return relative time 1 hour ago', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15T12:00:00Z'));

    const formatter = createFormatter(mockI18n());
    const oneHourAgo = Math.floor(new Date('2024-06-15T11:00:00Z').getTime() / 1000);
    const result = formatter.formatRelativeTime(oneHourAgo);
    expect(result).toMatch(/hour/);
  });

  test('should return empty for 0', () => {
    const formatter = createFormatter(mockI18n());
    expect(formatter.formatRelativeTime(0)).toBe('');
  });

  test('should return "2 days ago"', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15T12:00:00Z'));

    const formatter = createFormatter(mockI18n());
    const twoDaysAgo = Math.floor(new Date('2024-06-13T12:00:00Z').getTime() / 1000);
    const result = formatter.formatRelativeTime(twoDaysAgo);
    expect(result).toMatch(/2 days/);
  });
});

describe('formatDateTime (moment behavior snapshot)', () => {
  test('should return formatted date for valid timestamp', () => {
    const formatter = createFormatter(mockI18n());
    const date = new Date('2024-06-15T14:30:00Z');
    const unix = Math.floor(date.getTime() / 1000);
    const result = formatter.formatDateTime(unix);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    // Should contain the date
    expect(result).toMatch(/2024|Jun/);
  });

  test('should return empty for 0 timestamp', () => {
    const formatter = createFormatter(mockI18n());
    expect(formatter.formatDateTime(0)).toBe('');
  });
});

describe('formatShortDate (moment behavior snapshot)', () => {
  test('should return YYYY-MM-DD format', () => {
    const formatter = createFormatter(mockI18n());
    const date = new Date('2024-06-15T00:00:00Z');
    const unix = Math.floor(date.getTime() / 1000);
    const result = formatter.formatShortDate(unix);
    expect(result).toBe('2024-06-15');
  });

  test('should return empty for 0', () => {
    const formatter = createFormatter(mockI18n());
    expect(formatter.formatShortDate(0)).toBe('');
  });
});

describe('formatTimestamp (moment behavior snapshot)', () => {
  test('should return HH:mm:ss format', () => {
    const formatter = createFormatter(mockI18n());
    // Use local time to avoid timezone issues
    const now = new Date();
    now.setHours(14, 30, 45, 0);
    const unix = Math.floor(now.getTime() / 1000);
    const result = formatter.formatTimestamp(unix);
    expect(result).toBe('14:30:45');
  });

  test('should return empty for 0', () => {
    const formatter = createFormatter(mockI18n());
    expect(formatter.formatTimestamp(0)).toBe('');
  });
});

describe('formatAbbreviatedDuration (moment behavior snapshot)', () => {
  test('should return abbreviated duration for 2 hours', () => {
    const formatter = createFormatter(mockI18n());
    const result = formatter.formatAbbreviatedDuration(7200);
    expect(result).toBe('2 h');
  });

  test('should return abbreviated duration for 30 seconds', () => {
    const formatter = createFormatter(mockI18n());
    const result = formatter.formatAbbreviatedDuration(30);
    expect(result).toBe('30 s');
  });

  test('should return abbreviated duration for 2 minutes', () => {
    const formatter = createFormatter(mockI18n());
    const result = formatter.formatAbbreviatedDuration(120);
    expect(result).toBe('2 m');
  });
});

describe('formatSeconds (moment behavior snapshot)', () => {
  test('should humanize 3600 seconds as "an hour"', () => {
    const formatter = createFormatter(mockI18n());
    const result = formatter.formatSeconds(3600);
    expect(result).toBe('an hour');
  });

  test('should humanize 60 seconds as "a minute"', () => {
    const formatter = createFormatter(mockI18n());
    const result = formatter.formatSeconds(60);
    expect(result).toBe('a minute');
  });
});

describe('formatCalendarTime (moment behavior snapshot)', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test('should return calendar time for today (with i18n)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15T12:00:00Z'));

    const i18nWithToday = {
      t: (key: string) => {
        if (key === 'common.today') return 'Today';
        return key;
      },
      language: 'en',
    } as unknown as typeof i18n;

    const formatter = createFormatter(i18nWithToday);
    const todayUnix = Math.floor(new Date('2024-06-15T10:00:00Z').getTime() / 1000);
    const result = formatter.formatCalendarTime(todayUnix);
    expect(result).toContain('Today');
  });
});

describe('formatUnits (moment behavior snapshot)', () => {
  test('should format bytes with units', () => {
    const formatter = createFormatter(mockI18n());
    const result = formatter.formatSize(1024);
    expect(result).toContain('1');
  });

  test('should format 0 bytes', () => {
    const formatter = createFormatter(mockI18n());
    const result = formatter.formatSize(0);
    expect(result).toContain('0');
  });
});
