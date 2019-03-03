import Moment from 'moment';
import i18next from 'i18next';

import { toI18nKey } from './TranslationUtils';
import * as UI from 'types/ui';


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

const formatUnitsPerSecond = (units: string, t: i18next.TFunction) => {
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

const formatUnits = (value: number, units: string[], threshold: number, t: i18next.TFunction) => {
  let u = 0;
  if (Math.abs(value) >= threshold) {
    do {
      value /= threshold;
      ++u;
    } while (Math.abs(value) >= threshold && u < units.length - 1);
  }

  const formattedValue = value > 0 ? value.toFixed(2) : '0';
  const localizedUnit = t(
    toI18nKey(units[u].toLowerCase(), [ UI.Modules.COMMON, UI.SubNamespaces.UNITS ]),
    units[u]
  );

  return `${formattedValue} ${localizedUnit}`;
};


const byteUnits = [ 'B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB' ];

export const formatSize = (bytes: number, t: i18next.TFunction) => {
  return formatUnits(bytes, byteUnits, 1024, t);
};


const bitUnits = [ 'bit/s', 'Kbit/s', 'Mbit/s', 'Gbit/s' ];

export const formatConnection = (bytes: number, t: i18next.TFunction) => {
  if (bytes === 0) {
    return null;
  }

  return formatUnits(bytes, bitUnits, 1000, t);
};

// http://momentjs.com/docs/#/displaying/from/
export const formatRelativeTime = (time: number) => {
  if (time === 0) {
    return '';
  }

  return Moment.unix(time).from(Moment());
};

// http://momentjs.com/docs/#/displaying/calendar-time/
export const formatCalendarTime = (time: number) => {
  if (time === 0) {
    return '';
  }

  return Moment.unix(time).calendar(undefined, {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'DD/MM/YYYY'
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

export const formatSpeed = (bytesPerSecond: number, t: i18next.TFunction) => {
  return formatUnitsPerSecond(formatSize(bytesPerSecond, t), t);
};

export const formatAverage = (countFrom: number, total: number) => {
  return (total === 0 ? 0 : (countFrom / total)).toFixed(2);
};

export const formatPercentage = (countFrom: number, total: number) => {
  return `${(parseFloat(formatAverage(countFrom, total)) * 100).toFixed(2)} %`;
};
