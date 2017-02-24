import Moment from 'moment';

const abbreviatedRelativeUnits = {
	relativeTime: {
		future: '%s',
		past:   '%s',
		s:  '%d s',
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
	relativeTime:	Moment.localeData('en')._relativeTime
};


const byteUnits = [ 'kB','MB','GB','TB','PB','EB','ZB','YB' ];
const bitUnits = [ ' bit', ' Kbit', ' Mbit', ' Gbit', ' Tbit', ' Pbit' ];

const Format = {
	formatSize: function (fileSizeInBytes) {
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
	},

	formatConnection: function (bytes) {
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
	},

	// http://momentjs.com/docs/#/displaying/from/
	formatRelativeTime: function (time) {
		if (time === 0) {
			return '';
		}

		return Moment.unix(time).from(Moment());
	},

	// http://momentjs.com/docs/#/displaying/calendar-time/
	formatCalendarTime: function (time) {
		if (time === 0) {
			return '';
		}

		return Moment.unix(time).calendar(null, {
			sameDay: '[Today]',
			nextDay: '[Tomorrow]',
			nextWeek: 'dddd',
			lastDay: '[Yesterday]',
			lastWeek: '[Last] dddd',
			sameElse: 'DD/MM/YYYY'
		});
	},

	formatDateTime: function (time) {
		if (time === 0) {
			return '';
		}

		return Moment.unix(time).format('LLL');
	},

	formatShortDate: function (time) {
		if (time === 0) {
			return '';
		}

		return Moment.unix(time).format('YYYY-MM-DD');
	},

	// http://momentjs.com/docs/#/displaying/to/
	formatAbbreviatedDuration: function (time) {
		const now = Moment();
		const finish = Moment().add(time, 'seconds');

		// Change the relative units temporarily
		Moment.updateLocale('en', abbreviatedRelativeUnits);
		const ret = now.to(finish);
		Moment.updateLocale('en', normalRelativeUnits);

		return ret;
	},

	formatTimestamp: function (time) {
		if (time === 0) {
			return '';
		}

		return Moment.unix(time).format('HH:mm:ss');
	},

	formatBool: function (value) {
		return value ? 'Yes' : 'No';
	},

	formatDecimal: function (value) {
		return parseFloat(Math.round(value * 100) / 100).toFixed(2);
	},
};

const formatSpeed = (bytesPerSecond) => {
	return Format.formatSize(bytesPerSecond) + '/s';
};

const formatAverage = (countFrom, total) => {
	return (total === 0 ? 0 : (countFrom / total)).toFixed(2);
};

const formatPercentage = (countFrom, total) => {
	return (formatAverage(countFrom, total) * 100).toFixed(2) + ' %';
};

export default {
	...Format,
	formatSpeed,
	formatPercentage,
	formatAverage,
};
