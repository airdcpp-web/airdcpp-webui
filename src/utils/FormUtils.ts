import invariant from 'invariant';
import t from 'utils/tcomb-form';

import { FieldTypes } from 'constants/SettingConstants';

import BrowseField from 'components/form/BrowseField';
import SelectField from 'components/form/SelectField';


const typeToComponent = (type: API.SettingType, min: number | undefined, max: number | undefined) => {
  switch (type) {
    case FieldTypes.NUMBER: {
      if (min || max) {
        return t.Range(min, max);
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

  throw 'Field type ' + type + ' is not supported';
};

const parseDefinitions = (definitions: UI.FormFieldDefinition[]) => {
  const ret = definitions.reduce(
    (reduced, def) => {
      if (def.type === FieldTypes.LIST) {
        if (def.item_type === FieldTypes.STRUCT) {
          reduced[def.key] = t.list(parseDefinitions(def.definitions!));
        } else {
          reduced[def.key] = t.list(typeToComponent(def.item_type!, def.min, def.max));
        }
      } else {
        const fieldComponent = typeToComponent(def.type, def.min, def.max);
        reduced[def.key] = def.optional ? t.maybe(fieldComponent) : fieldComponent;
      }

      return reduced;
    }, 
    {}
  );

  return t.struct(ret);
};

//type FormSettingValueBase = API.SettingValueBase | { id: API.SettingValue };
//type FormSettingValue = FormSettingValueBase | FormSettingValueBase[];

/*interface FormValue {
  [key: string]: API.SettingValue;
}*/

const normalizeField = (value?: API.SettingValue) => {
  /*if (value) {
    // Convert { id, ... } objects used in the UI to plain IDs
    // Not used by the API
    if (typeof value === 'object' && !Array.isArray(value)) {
      // Normalize object properties with value.id to plain id 
      invariant(value.hasOwnProperty('id'), 'Invalid object supplied for normalizeField (id property is required)');
      return value.id;
    } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      // Normalize each array item
      invariant(
        value[0].hasOwnProperty('id'), 
        'Invalid array supplied for form property (id property is required for values)'
      );
      const tmp = value[0];
      console.log(tmp);
      return value.map(normalizeField);
    }
  } else*/ 
  
  if (value === '') {
    // Normalize empty strings to null, which is used by tcomb 
    return null;
  }

  return value;
};

const normalizeEnumValue = (rawItem: API.SettingEnumOption) => {
  return {
    value: rawItem.id,
    text: rawItem.name
  };
};

const normalizeSettingValueMap = (
  value: Partial<API.SettingValueMap> | undefined, 
  valueDefinitions: UI.FormFieldDefinition[]
): UI.FormValueMap => {
  return valueDefinitions.reduce(
    (reducedValue, { key, type, definitions, default_value, item_type }) => {
      if (!!value && value.hasOwnProperty(key)) {
        const fieldValue = value[key];
        if (type === FieldTypes.LIST && Array.isArray(fieldValue)) {
          if (item_type === FieldTypes.STRUCT) {
            // Normalize each list object
            reducedValue[key] = fieldValue.map((arrayItem) => {
              if (!!arrayItem && typeof arrayItem === 'object') {
                return normalizeSettingValueMap(arrayItem, definitions!);
              }

              throw `Invalid value for a list struct ${arrayItem}`;
            });
          } else {
            reducedValue[key] = fieldValue.map(normalizeField);
          }
        } else {
          reducedValue[key] = normalizeField(fieldValue);
        }
      } else if (!value) {
        // Initialize empty value but don't merge missing fields into an existing value (we might be merging)
        reducedValue[key] = default_value ? default_value : null;
      }

      return reducedValue;
    }, 
    {}
  );
};

const intTransformer = {
  parse: (v: string) => v === 'null' ? null : parseInt(v, 10),
  format: (v: number) => String(v),
};

const parseTypeOptions = (type: API.SettingType) => {
  const options = {};
  switch (type) {
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
        //isFile: type === FieldTypes.FILE_PATH
        isFile: false
      };
      break;
    }
    default:
  }

  return options;
};

const parseFieldOptions = (definition: UI.FormFieldDefinition) => {
  const options = parseTypeOptions(definition.type);

  // List item options
  if (definition.type === FieldTypes.LIST) {
    options['item'] = {};
    if (definition.definitions) {
      // Struct item fields
      options['item']['fields'] = definition.definitions.reduce(
        (reduced, itemDefinition) => {
          reduced[itemDefinition.key] = parseFieldOptions(itemDefinition);
          return reduced;
        }, 
        {}
      );
    } else {
      // Plain items
      options['item'] = parseTypeOptions(definition.item_type!);
    }
  }

  // Captions
  options['legend'] = definition.title;
  options['help'] = definition.help;

  // Enum select field?
  if (definition.options) {
    invariant(
      Array.isArray(definition.options) && definition.options.length > 0, 
      'Incorrect enum options supplied: ' + JSON.stringify(definition.options)
    );

    Object.assign(options, {
      factory: t.form.Select,
      options: definition.options.map(normalizeEnumValue),
      nullOption: false,
    });

    if (definition.type === FieldTypes.LIST) {
      options['template'] = SelectField;
    } else if (definition.options[0].id === parseInt(definition.options[0].id as string, 10)) {
      // Integer keys won't work with the default template, do string conversion
      options['transformer'] = intTransformer;
    }
  }

  return options;
};

export {
  // Migrates simple key -> value fields to an array that is compatible with the form
  // undefined values will also be initialized with nulled property fields
  normalizeSettingValueMap,

  intTransformer,

  normalizeEnumValue,

  // Convert field definitions to tcomb type object
  // Note that there are additional field options that need to be handled separately
  parseDefinitions,

  parseFieldOptions,
}
;
