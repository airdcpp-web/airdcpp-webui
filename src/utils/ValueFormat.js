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

const Format = {
	formatSize: function (fileSizeInBytes) {
		let i = 0;
		const byteUnits = [ ' b', ' kB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB' ];
		do {
			fileSizeInBytes = fileSizeInBytes / 1024;
			i++;
		} while (fileSizeInBytes > 1024);

		return Math.max(fileSizeInBytes, 0.0).toFixed(2) + byteUnits[i];
	},

	formatConnection: function (bytes) {
		let bits = bytes*8;
		let i = 0;

		const bitUnits = [ ' bit', ' Kbit', ' Mbit', ' Gbit', ' Tbit', ' Pbit' ];
		do {
			bits = bits / 1000;
			i++;
		} while (bits > 1000);

		return Math.max(bits, 0.0).toFixed(2) + bitUnits[i] + '/s';
	},

	formatRelativeTime: function (time) {
		if (time === 0) {
			return 'Unknown';
		}

		return Moment.unix(time).from(Moment());
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

	formatAbbreviatedDuration: function (time) {
		const now = Moment();
		const finish = Moment().add(time, 'seconds');

		// Change the relative units temporarily
		Moment.locale('en', abbreviatedRelativeUnits);
		const ret = now.to(finish);
		Moment.locale('en', normalRelativeUnits);

		return ret;
	},

	formatTimestamp: function (time) {
		if (time == 0) {
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

export default {
	...Format,
	formatSpeed,
};
