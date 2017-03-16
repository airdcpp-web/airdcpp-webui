import invariant from 'invariant';
import t from 'utils/tcomb-form';

import { FieldTypes } from 'constants/SettingConstants';


const parse = function (v) {
	if (v === 'null') {
		return null;
	}

	return parseInt(v, 10);
};

const format = function (v) {
	return String(v);
};

const typeToField = (type) => {
	switch (type) {
		case FieldTypes.NUMBER: return t.Positive;
		case FieldTypes.BOOLEAN: return t.Bool;
		case FieldTypes.STRING:
		case FieldTypes.TEXT:
		case FieldTypes.FILE_PATH:
		case FieldTypes.DIRECTORY_PATH: return t.Str;
		default: 
	}

	return null;
};

const parseFieldType = (info) => {
	const fieldComponent = typeToField(info.type);
	return info.optional ? t.maybe(fieldComponent) : fieldComponent;
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
				} else if (Array.isArray(valueMap[key]) && valueMap[key].length > 0 && typeof valueMap[key][0] === 'object') {
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

	parseFields(definitions) {
		return Object.keys(definitions).reduce((reduced, key) => {
			reduced[key] = parseFieldType(definitions[key]);
			return reduced;
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
