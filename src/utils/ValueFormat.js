import Moment from 'moment';

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

	formatDateTime: function (time) {
		if (time == 0) {
			return '';
		}

		return Moment.unix(time).format('LLL');
	},

	formatTimestamp: function (time) {
		if (time == 0) {
			return '';
		}

		//return Moment.unix(time).format("LTS");
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

export default Object.assign(Format, {
	formatSpeed: formatSpeed,
});
