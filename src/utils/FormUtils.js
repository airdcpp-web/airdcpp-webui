import invariant from 'invariant';
import t from 'utils/tcomb-form';

import { FieldTypes } from 'constants/SettingConstants';

import BrowseField from 'components/form/BrowseField';


const parse = function (v) {
	if (v === 'null') {
		return null;
	}

	return parseInt(v, 10);
};

const format = function (v) {
	return String(v);
};

const typeToField = (info) => {
	switch (info.type) {
		case FieldTypes.NUMBER: {
			if (info.min || info.max) {
				return t.Range(info.min, info.max);
			}
			return t.Positive;
		}
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
	const fieldComponent = typeToField(info);
	invariant(fieldComponent, 'Field type ' + info.type + ' is not supported');
	return info.optional ? t.maybe(fieldComponent) : fieldComponent;
};

const normalizeField = (value) => {
	if (value) {
		if (typeof value === 'object' && !Array.isArray(value)) {
			// Normalize object properies value.prop.id to value.prop 
			invariant(value.hasOwnProperty('id'), 'Invalid object supplied for valueMapToInfo (id property is required)');
			return value.id;
		} else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
			// Normalize each array item
			invariant(value[0].hasOwnProperty('id'), 'Invalid array supplied for form property (id property is required for values)');
			return value.map(normalizeField);
		} else if (value === '') {
			// Normalize empty strings to null, which is used by tcomb 
			return null;
		}
	}

	return value;
};

const normalizeEnumValue = (rawItem) => {
	return {
		value: rawItem.id,
		text: rawItem.name
	};
};

const intTransformer = {
	format: format,
	parse: parse
};

export default {
	// Migrates simple key -> value fields to an array that is compatible with the form
	// undefined values will also be initialized with nulled property fields
	normalizeValue: function (value, fieldDefinitions, defaultValue) {
		return Object.keys(fieldDefinitions).reduce((reducedValue, key) => {
			if (value && value.hasOwnProperty(key)) {
				reducedValue[key] = normalizeField(value[key] === undefined ? defaultValue[key] : value[key]);
			} else if (!value) {
				// Initialize empty value but don't merge missing fields into an existing value (we might be merging)
				reducedValue[key] = null;
			}

			return reducedValue;
		}, {});
	},

	// Convert field definitions to tcomb type object
	// Note that there are additional field options that need to be handled separately
	parseDefinitions(definitions) {
		return Object.keys(definitions).reduce((reduced, key) => {
			reduced[key] = parseFieldType(definitions[key]);
			return reduced;
		}, {});
	},

	parseFieldOptions(definitions) {
		const options = {};

		// Field type
		switch (definitions.type) {
			case FieldTypes.TEXT: {
				options['type'] = 'textarea';
				break;
			} 
			//case FieldTypes.FILE_PATH:
			case FieldTypes.DIRECTORY_PATH: {
				options['factory'] = t.form.Textbox;
				options['template'] = BrowseField;

				// TODO: file selector dialog
				options['config'] = {
					isFile: definitions.type === FieldTypes.FILE_PATH
				};
			}
			default:
		}

		// Title
		options['legend'] = definitions.title;

		// Enum select field?
		if (definitions.values) {
			invariant(Array.isArray(definitions.values) && definitions.values.length > 0, 'Incorrect enum values supplied: ' + JSON.stringify(definitions.values));
			Object.assign(options, {
				factory: t.form.Select,
				options: definitions.values.map(normalizeEnumValue),
				nullOption: false,
			});

			// Integer keys won't work, do string conversion
			if (definitions.values[0].id === parseInt(definitions.values[0].id, 10)) {
				options['transformer'] = intTransformer;
			}
		}

		return options;
	},
}
;
