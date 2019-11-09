import Moment from 'moment';
import { TFunction } from 'i18next';

import { toI18nKey, translate } from './TranslationUtils';
import * as UI from 'types/ui';
import { i18n } from 'services/LocalizationService';


const abbreviatedRelativeUnits = {
  relativeTime: {
    future: '%s',
    past:   '%s',
    s:  '%d s',
    ss: '%d s',
    m:  '%d m',
    mm: '%d m',
    h:  '%d h',
    hh: '%d h',
    d:  '%d d',
    dd: '%d d',
    M:  '%d M',
    MM: '%d M',
    y:  '%d y',
    yy: '%d y',
  }
};

const getNormalRelativeUnits = () => ({
  relativeTime:	(Moment.localeData(Moment.locale()) as any)._relativeTime
});

const formatUnitsPerSecond = (units: string, t: TFunction) => {
  return t(
    toI18nKey('unitsPerSecond', UI.Modules.COMMON),
    {
      defaultValue: '{{units}}/s',
      replace: {
        units,
      }
    }
  );
};

export const formatUnit = (unit: string, t: TFunction) => {
  return t(
    toI18nKey(unit.toLowerCase().replace('/', ''), [ UI.Modules.COMMON, UI.SubNamespaces.UNITS ]),
    unit
  );
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

const formatUnits = (initialValue: number, units: string[], threshold: number, t: TFunction) => {
  const { unitIndex, value } = parseUnit(initialValue, units, threshold);

  const formattedValue = value > 0 ? value.toFixed(2) : '0';
  const localizedUnit = formatUnit(units[unitIndex], t);
  return `${formattedValue} ${localizedUnit}`;
};


export const ByteUnits = [ 'B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB' ];

export const formatSize = (bytes: number, t: TFunction, addExact: boolean = false) => {
  let ret = formatUnits(bytes, ByteUnits, 1024, t);
  if (addExact && bytes > 1024) {
    ret += ` (${t(
      toI18nKey('xBytes', UI.Modules.COMMON),
      {
        defaultValue: '{{bytes}} bytes',
        replace: {
          bytes: bytes.toLocaleString(i18n.language),
        }
      }
    )})`;
  }

  return ret;
};


const bitUnits = [ 'bit/s', 'Kbit/s', 'Mbit/s', 'Gbit/s' ];

export const formatConnection = (bytes: number, t: TFunction) => {
  if (bytes === 0) {
    return null;
  }

  return formatUnits(bytes * 8, bitUnits, 1000, t);
};

// http://momentjs.com/docs/#/displaying/from/
export const formatRelativeTime = (time: number) => {
  if (time === 0) {
    return '';
  }

  return Moment.unix(time).from(Moment());
};

// http://momentjs.com/docs/#/displaying/calendar-time/
export const formatCalendarTime = (time: number, t: TFunction) => {
  if (time === 0) {
    return '';
  }

  return Moment.unix(time).calendar(undefined, {
    sameDay: `[${translate('Today', t, UI.Modules.COMMON)}]`,
    nextDay: `[${translate('Tomorrow', t, UI.Modules.COMMON)}]`,
    nextWeek: 'dddd',
    lastDay: `[${translate('Yesterday', t, UI.Modules.COMMON)}]`,
    lastWeek: t(toI18nKey('lastWeek', UI.Modules.COMMON), {
      defaultValue: '[Last] {{weekDay}}',
      replace: {
        weekDay: 'dddd',
      }
    }),
    sameElse: Moment.locale() === 'en' ? 'DD/MM/YYYY' : 'L',
  });
};

export const formatDateTime = (time: number) => {
  if (time === 0) {
    return '';
  }

  return Moment.unix(time).format('LLL');
};

export const formatShortDate = (time: number) => {
  if (time === 0) {
    return '';
  }

  return Moment.unix(time).format('YYYY-MM-DD');
};

// http://momentjs.com/docs/#/displaying/to/
export const formatAbbreviatedDuration = (time: number) => {
  const now = Moment();
  const finish = Moment().add(time, 'seconds');

  // Change the relative units temporarily
  const normalRelativeUnits = getNormalRelativeUnits();
  Moment.updateLocale(Moment.locale(), abbreviatedRelativeUnits);

  const ret = now.to(finish);
  Moment.updateLocale(Moment.locale(), normalRelativeUnits);

  return ret;
};

export const formatTimestamp = (time: number) => {
  if (time === 0) {
    return '';
  }

  return Moment.unix(time).format('HH:mm:ss');
};

export const formatDecimal = (value: number) => {
  return parseFloat(Math.round(value * 100) / 100 as any).toFixed(2);
};

export const formatSpeed = (bytesPerSecond: number, t: TFunction) => {
  return formatUnitsPerSecond(formatSize(bytesPerSecond, t), t);
};

export const formatAverage = (countFrom: number, total: number) => {
  return (total === 0 ? 0 : (countFrom / total)).toFixed(2);
};

export const formatPercentage = (countFrom: number, total: number) => {
  return `${(parseFloat(formatAverage(countFrom, total)) * 100).toFixed(2)} %`;
};

export const formatBoolean = (value: boolean, t: TFunction) => {
  return value ? translate('Yes', t, UI.Modules.COMMON) : translate('No', t, UI.Modules.COMMON);
};
