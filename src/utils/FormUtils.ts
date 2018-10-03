import invariant from 'invariant';
import t from 'utils/tcomb-form';

import BrowseField from 'components/form/BrowseField';
import SelectField from 'components/form/SelectField';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { isArray } from 'util';
import isEqual from 'lodash/isEqual';


const typeToComponent = (
  type: API.SettingTypeEnum, 
  min: number | undefined, 
  max: number | undefined, 
  isEnum: boolean
) => {
  switch (type) {
    case API.SettingTypeEnum.NUMBER: {
      if (min || max) {
        return t.Range(min, max);
      }
      return isEnum ? t.Number : t.Positive;
    }
    case API.SettingTypeEnum.BOOLEAN: return t.Bool;
    case API.SettingTypeEnum.STRING:
    case API.SettingTypeEnum.TEXT:
    case API.SettingTypeEnum.FILE_PATH:
    case API.SettingTypeEnum.DIRECTORY_PATH: return t.Str;
    default: 
  }

  throw `Field type ${type} is not supported`;
};

const parseDefinitions = (definitions: UI.FormFieldDefinition[]) => {
  const ret = definitions.reduce(
    (reduced, def) => {
      if (def.type === API.SettingTypeEnum.LIST) {
        if (def.item_type === API.SettingTypeEnum.STRUCT) {
          reduced[def.key] = t.list(parseDefinitions(def.definitions!));
        } else {
          reduced[def.key] = t.list(typeToComponent(def.item_type!, def.min, def.max, !!def.options));
        }
      } else {
        if (def.type === API.SettingTypeEnum.STRUCT) {
          reduced[def.key] = parseDefinitions(def.definitions!);
        } else {
          const fieldComponent = typeToComponent(def.type, def.min, def.max, !!def.options);
          reduced[def.key] = def.optional ? t.maybe(fieldComponent) : fieldComponent;
        }
      }

      return reduced;
    }, 
    {}
  );

  return t.struct(ret);
};

type IdItemValue = { id: API.SettingValueBase };
type FormSettingValue = API.SettingValue<UI.FormValueBase> | IdItemValue[];

const normalizeField = <T>(value?: FormSettingValue): API.SettingValue | T => {
  if (value) {
    // Convert { id, ... } objects used in the UI to plain IDs
    // Not used by the API
    if (typeof value === 'object' && !Array.isArray(value)) {
      // Normalize object properties with value.id to plain id 
      invariant(value.hasOwnProperty('id'), 'Invalid object supplied for normalizeField (id property is required)');
      return (value as IdItemValue).id;
    } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      // Normalize each array item
      invariant(
        value[0]!.hasOwnProperty('id'), 
        'Invalid array supplied for form property (id property is required for values)'
      );

      const ret = (value as IdItemValue[]).map(normalizeField);
      return ret as API.SettingValueBase[];
    }
  } else if (value === '') {
    // Normalize empty strings to null, which is used by tcomb 
    return null;
  }

  return value as API.SettingValue;
};

const normalizeEnumValue = (rawItem: API.SettingEnumOption) => {
  return {
    value: rawItem.id,
    text: rawItem.name
  };
};

const normalizeSettingValueMap = (
  value: Partial<API.SettingValueMap<UI.FormValueBase>> | undefined, 
  valueDefinitions: UI.FormFieldDefinition[]
): UI.FormValueMap => {
  return valueDefinitions.reduce(
    (reducedValue, { key, type, definitions, default_value, item_type }) => {
      if (!!value && value.hasOwnProperty(key)) {
        const fieldValue = value[key];
        if (type === API.SettingTypeEnum.LIST && Array.isArray(fieldValue)) {
          if (item_type === API.SettingTypeEnum.STRUCT) {
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
        } else if (type === API.SettingTypeEnum.STRUCT) {
          if (!!fieldValue && typeof fieldValue === 'object' && !isArray(fieldValue)) {
            reducedValue[key] = normalizeSettingValueMap(fieldValue, definitions!);
          } else {
            throw `Invalid value for a struct ${key}`;
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
  parse: (v: string) => {
    return v === 'null' || v === undefined || v === null ? null : parseInt(v, 10);
  },
  format: (v: number) => {
    return String(v);
  },
};

const parseTypeOptions = (type: API.SettingTypeEnum) => {
  const options = {};
  switch (type) {
    case API.SettingTypeEnum.TEXT: {
      options['type'] = 'textarea';
      break;
    } 
    //case FieldTypes.FILE_PATH:
    case API.SettingTypeEnum.DIRECTORY_PATH: {
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

const parseTitle = (definition: UI.FormFieldDefinition) => {
  if (definition.title && definition.optional) {
    return `${definition.title} (optional)`;
  }

  return definition.title;
};

const parseFieldOptions = (definition: UI.FormFieldDefinition) => {
  const options = parseTypeOptions(definition.type);

  // List item options
  if (definition.type === API.SettingTypeEnum.LIST) {
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
  options['legend'] = parseTitle(definition);
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

    if (definition.type === API.SettingTypeEnum.LIST) {
      options['template'] = SelectField;
    } else if (definition.options[0].id === parseInt(definition.options[0].id as string, 10)) {
      // Integer keys won't work with the default template, do string conversion
      options['transformer'] = intTransformer;
    }
  }

  return options;
};

const findFieldValueByPath = (obj: object, path: string[]): any => {
  const value = obj[path[0]];
  if (value && typeof value === 'object' && path.length > 1) {
    path.shift();
    return findFieldValueByPath(value, path);
  }

  return value;
};

const setFieldValueByPath = (obj: object, newValue: any, path: string[]): any => {
  const curKey = path[0];
  if (path.length > 1) {
    obj[curKey] = obj[curKey] || {};
    path.shift();
    setFieldValueByPath(obj[curKey], newValue, path);
  } else {
    obj[curKey] = newValue;
  }
};

const reduceChangedFieldValues = (
  sourceValue: UI.FormValueMap | null,
  currentFormValue: Partial<UI.FormValueMap>, 
  changedValues: Partial<UI.FormValueMap>,
  valueKey: string
) => {
  if (!!sourceValue && currentFormValue[valueKey] instanceof Object && !Array.isArray(currentFormValue[valueKey])) {
    const settingKeys = Object.keys(currentFormValue[valueKey]!);
    changedValues[valueKey] = settingKeys.reduce(
      reduceChangedFieldValues.bind(
        null,
        sourceValue[valueKey], 
        currentFormValue[valueKey]
      ), 
      {}
    );
  } else {
    if (!sourceValue || !isEqual(sourceValue[valueKey], currentFormValue[valueKey])) {
      changedValues[valueKey] = currentFormValue[valueKey];
    }
  }

  return changedValues;
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

  // Reduces an object of current form values that don't match the source data
  reduceChangedFieldValues,

  findFieldValueByPath,
  setFieldValueByPath,
}
;
