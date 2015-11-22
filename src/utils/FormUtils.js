const parse = function (v) {
	if (v === 'null') {
		return null;
	}

	return parseInt(v, 10);
};

const format = function (v) {
	return String(v);
};

export default {
	// Migrates simple key -> value fields to an array that is compatible with the form
	valueMapToInfo: function (valueMap, keys = null) {
		if (!keys) {
			keys = Object.keys(valueMap);
		}

		return keys.reduce((convertedData, key) => {
			let value = null;
			if (valueMap && valueMap.hasOwnProperty(key)) {
				if (typeof valueMap[key] === 'object') {
					console.assert(valueMap[key].hasOwnProperty('id'), 'Invalid object supplied for valueMapToInfo (id property is required)');
					value = valueMap[key].id;
				} else {
					value = valueMap[key];
				}
			}

			convertedData[key] = { 
				key: key,
				value: value,
			};

			return convertedData;
		}, {});
	},

	intTransformer: {
		format: format,
		parse: parse
	},
}
;
