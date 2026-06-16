import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';
import duration from 'dayjs/plugin/duration';
import localeData from 'dayjs/plugin/localeData';

dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.extend(duration);
dayjs.extend(localeData);

import { toI18nKey, translate } from './TranslationUtils';
import * as UI from '@/types/ui';
import { i18n } from 'i18next';
import { ByteUnits } from './ValueFormat';

const formatUnit = (unit: string, t: UI.TranslateF) => {
  return t(
    toI18nKey(unit.toLowerCase().replace('/', ''), [
      UI.Modules.COMMON,
      UI.SubNamespaces.UNITS,
    ]),
    unit,
  );
};

const formatUnitsPerSecond = (units: string, t: UI.TranslateF) => {
  return t(toI18nKey('unitsPerSecond', UI.Modules.COMMON), {
    defaultValue: '{{units}}/s',
    replace: {
      units,
    },
  });
};

export const parseUnit = (value: number, units: string[], threshold: number) => {
  let unitIndex = 0;
  if (Math.abs(value) >= threshold) {
    do {
      value /= threshold;
      ++unitIndex;
    } while (Math.abs(value) >= threshold && unitIndex < units.length - 1);
  }

  return {
    value,
    unitIndex,
  };
};

const formatUnits = (
  initialValue: number,
  units: string[],
  threshold: number,
  t: UI.TranslateF,
  decimals = 2,
) => {
  const { unitIndex, value } = parseUnit(initialValue, units, threshold);

  const formattedValue = value > 0 ? value.toFixed(2) : '0';
  const localizedUnit = formatUnit(units[unitIndex], t);
  return `${formattedValue} ${localizedUnit}`;
};

const formatSize = (
  bytes: number,
  t: UI.TranslateF,
  i18n: i18n,
  decimals = 2,
  addExact = false,
) => {
  let ret = formatUnits(bytes, ByteUnits, 1024, t, decimals);
  if (addExact && bytes > 1024) {
    ret += ` (${t(toI18nKey('xBytes', UI.Modules.COMMON), {
      defaultValue: '{{bytes}} bytes',
      replace: {
        bytes: bytes.toLocaleString(i18n.language),
      },
    })})`;
  }

  return ret;
};

const bitUnits = ['bit/s', 'Kbit/s', 'Mbit/s', 'Gbit/s'];

const formatConnection = (bytes: number, t: UI.TranslateF) => {
  if (bytes === 0) {
    return null;
  }

  return formatUnits(bytes * 8, bitUnits, 1000, t);
};

const formatRelativeTime = (time: number) => {
  if (time === 0) {
    return '';
  }

  return dayjs.unix(time).fromNow();
};

const formatCalendarTime = (time: number, t: UI.TranslateF) => {
  if (time === 0) {
    return '';
  }

  return dayjs.unix(time).calendar(null, {
    sameDay: `[${translate('Today', t, UI.Modules.COMMON)}]`,
    nextDay: `[${translate('Tomorrow', t, UI.Modules.COMMON)}]`,
    nextWeek: 'dddd',
    lastDay: `[${translate('Yesterday', t, UI.Modules.COMMON)}]`,
    lastWeek: t(toI18nKey('lastWeek', UI.Modules.COMMON), {
      defaultValue: '[Last] {{weekDay}}',
      replace: {
        weekDay: 'dddd',
      },
    }),
    sameElse: dayjs.locale() === 'en' ? 'DD/MM/YYYY' : 'L',
  });
};

const formatDateTime = (time: number) => {
  if (time === 0) {
    return '';
  }

  return dayjs.unix(time).format('MMMM D, YYYY h:mm A');
};

const formatShortDate = (time: number) => {
  if (time === 0) {
    return '';
  }

  return dayjs.unix(time).format('YYYY-MM-DD');
};

const formatAbbreviatedDuration = (time: number) => {
  if (time < 60) {
    return `${Math.floor(time)} s`;
  }
  if (time < 3600) {
    return `${Math.floor(time / 60)} m`;
  }
  if (time < 86400) {
    return `${Math.floor(time / 3600)} h`;
  }
  return `${Math.floor(time / 86400)} d`;
};

const formatTimestamp = (time: number) => {
  if (time === 0) {
    return '';
  }

  return dayjs.unix(time).format('HH:mm:ss');
};

const formatSeconds = (seconds: number) => {
  return dayjs.duration(seconds, 'seconds').humanize();
};

const formatSpeed = (
  bytesPerSecond: number,
  t: UI.TranslateF,
  i18n: i18n,
  decimals = 2,
) => {
  return formatUnitsPerSecond(formatSize(bytesPerSecond, t, i18n, decimals), t);
};

const formatBoolean = (value: boolean, t: UI.TranslateF) => {
  return translate(value ? 'Yes' : 'No', t, UI.Modules.COMMON);
};

export const createFormatter = (i18n: i18n) => {
  const { t } = i18n;
  return {
    formatBoolean: (value: boolean) => {
      return formatBoolean(value, t);
    },

    formatSize: (bytes: number, decimals = 2, addExact = false) => {
      return formatSize(bytes, t, i18n, decimals, addExact);
    },

    formatSpeed: (bytesPerSecond: number, decimals = 2) => {
      return formatSpeed(bytesPerSecond, t, i18n, decimals);
    },

    formatConnection: (bytes: number) => {
      return formatConnection(bytes, t);
    },
    formatCalendarTime: (time: number) => {
      return formatCalendarTime(time, t);
    },
    formatUnits: (initialValue: number, units: string[], threshold: number) => {
      return formatUnits(initialValue, units, threshold, t);
    },
    formatUnit: (unit: string) => {
      return formatUnit(unit, t);
    },
    formatUnitsPerSecond: (units: string) => {
      return formatUnitsPerSecond(units, t);
    },
    formatRelativeTime,
    formatDateTime,
    formatShortDate,
    formatAbbreviatedDuration,
    formatTimestamp,
    formatSeconds,

    t,
  };
};
