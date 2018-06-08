import Moment from 'moment';

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

const normalRelativeUnits = {
  relativeTime:	(Moment.localeData('en') as any)._relativeTime
};


const byteUnits = [ 'kB','MB','GB','TB','PB','EB','ZB','YB' ];
const bitUnits = [ ' bit', ' Kbit', ' Mbit', ' Gbit', ' Tbit', ' Pbit' ];

export const formatSize = (fileSizeInBytes: number) => {
  const thresh = 1024;
  if (Math.abs(fileSizeInBytes) < thresh) {
    return fileSizeInBytes + ' B';
  }

  let u = -1;
  do {
    fileSizeInBytes /= thresh;
    ++u;
  } while (Math.abs(fileSizeInBytes) >= thresh && u < byteUnits.length - 1);

  return fileSizeInBytes.toFixed(2) + ' ' + byteUnits[u];
};

export const formatConnection = (bytes: number) => {
  if (bytes === 0) {
    return null;
  }

  let bits = bytes*8;
  let i = 0;

  do {
    bits = bits / 1000;
    i++;
  } while (bits > 1000);

  return Math.max(bits, 0.0).toFixed(2) + bitUnits[i] + '/s';
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
  Moment.updateLocale('en', abbreviatedRelativeUnits);
  const ret = now.to(finish);
  Moment.updateLocale('en', normalRelativeUnits);

  return ret;
};

export const formatTimestamp = (time: number) => {
  if (time === 0) {
    return '';
  }

  return Moment.unix(time).format('HH:mm:ss');
};

export const formatBool = (value: boolean) => {
  return value ? 'Yes' : 'No';
};

export const formatDecimal = (value: number) => {
  return parseFloat(Math.round(value * 100) / 100 as any).toFixed(2);
};

export const formatSpeed = (bytesPerSecond: number) => {
  return formatSize(bytesPerSecond) + '/s';
};

export const formatAverage = (countFrom: number, total: number) => {
  return (total === 0 ? 0 : (countFrom / total)).toFixed(2);
};

export const formatPercentage = (countFrom: number, total: number) => {
  return (parseFloat(formatAverage(countFrom, total)) * 100).toFixed(2) + ' %';
};
