import invariant from 'invariant';

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
			if (valueMap && valueMap.hasOwnProperty(key) && valueMap[key] !== null) {
				if (typeof valueMap[key] === 'object' && !Array.isArray(valueMap[key])) {
					invariant(valueMap[key].hasOwnProperty('id'), 'Invalid object supplied for valueMapToInfo (id property is required)');
					value = valueMap[key].id;
				} else if (Array.isArray(valueMap[key]) && valueMap[key].length > 0 && typeof valueMap[key][0]  === 'object') {
					invariant(valueMap[key][0].hasOwnProperty('id'), 'Invalid array supplied for form property (id property is required for values)');
					value = valueMap[key].map(profile => profile.id);
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

	convertRawProfile(profiles, rawItem) {
		profiles.push({
			value: rawItem.id,
			text: rawItem.name
		});

		return profiles;
	},
}
;
