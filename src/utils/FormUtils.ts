import invariant from 'invariant';
import tcomb, { Range, Positive } from 'utils/tcomb-form';

import { BrowseField, HintedUserSelectField, HubUrlField, SelectField } from 'components/form/fields';

import * as API from 'types/api';
import * as UI from 'types/ui';

import upperFirst from 'lodash/upperFirst';
import update from 'immutability-helper';

import { textToI18nKey } from './TranslationUtils';

import { Type, form } from 'types/ui/tcomb-form';
import { isEqualWith, isObject } from 'lodash';


const formValuesEqual = (parent1: any, parent2: any) => {
  return isEqualWith(parent1, parent2, (v1, v2) => {
    // Constructors may differ for object array values, causing incorrect results with isEqual
    if (
      isObject(v1) && 
      isObject(v2) && 
      Object.getPrototypeOf(v1).constructor.name !== Object.getPrototypeOf(v2).constructor.name
    ) {
      return isEqualWith({...v1}, {...v2}, formValuesEqual);
    }
  
    return undefined;
  });
};

const typeToComponent = (
  type: API.SettingTypeEnum, 
  min: number | undefined, 
  max: number | undefined, 
  isEnum: boolean
) => {
  switch (type) {
    case API.SettingTypeEnum.NUMBER: {
      if (min || max) {
        return Range(min, max);
      }
      return isEnum ? tcomb.Number : Positive;
    }
    case API.SettingTypeEnum.BOOLEAN: return tcomb.Bool;
    case API.SettingTypeEnum.STRING:
    case API.SettingTypeEnum.TEXT:
    case API.SettingTypeEnum.FILE_PATH:
    case API.SettingTypeEnum.HUB_URL:
    case API.SettingTypeEnum.DIRECTORY_PATH: return tcomb.Str;
    case API.SettingTypeEnum.HINTED_USER: return tcomb.struct({
      nicks: tcomb.Str,
      cid: tcomb.Str,
      hub_url: tcomb.Str,
    });
    default: 
  }

  throw `Field type ${type} is not supported`;
};

const parseDefinitions = (definitions: UI.FormFieldDefinition[]): Type<any> => {
  const ret = definitions.reduce(
    (reduced, def) => {
      if (def.type === API.SettingTypeEnum.LIST) {
        if (def.item_type === API.SettingTypeEnum.STRUCT) {
          reduced[def.key] = tcomb.list(parseDefinitions(def.definitions!));
        } else {
          reduced[def.key] = tcomb.list(typeToComponent(def.item_type!, def.min, def.max, !!def.options));
        }
      } else {
        if (def.type === API.SettingTypeEnum.STRUCT) {
          reduced[def.key] = parseDefinitions(def.definitions!);
        } else {
          const fieldComponent = typeToComponent(def.type, def.min, def.max, !!def.options);
          reduced[def.key] = def.optional ? tcomb.maybe(fieldComponent) : fieldComponent;
        }
      }

      return reduced;
    }, 
    {}
  );

  return tcomb.struct(ret);
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
          } else if (item_type === API.SettingTypeEnum.HINTED_USER) {
            reducedValue[key] = fieldValue;
          } else {
            reducedValue[key] = fieldValue.map(normalizeField);
          }
        } else if (type === API.SettingTypeEnum.STRUCT) {
          if (!!fieldValue && typeof fieldValue === 'object' && !Array.isArray(fieldValue)) {
            reducedValue[key] = normalizeSettingValueMap(fieldValue, definitions!);
          } else {
            throw `Invalid value for a struct ${key}`;
          }
        } else if (type === API.SettingTypeEnum.HINTED_USER) {
          reducedValue[key] = fieldValue;
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
  parse: (v: string | null | undefined) => {
    return v === 'null' || v === 'undefined' || v === undefined || v === null ? null : parseInt(v, 10);
  },
  format: (v: number| null | undefined) => {
    return String(v);
  },
};

const parseTypeOptions = (type: API.SettingTypeEnum): form.TcombOptions => {
  const options: form.TcombOptions = {};
  switch (type) {
    case API.SettingTypeEnum.TEXT: {
      options.type = 'textarea';
      break;
    } 
    //case FieldTypes.FILE_PATH:
    case API.SettingTypeEnum.DIRECTORY_PATH: {
      options.factory = tcomb.form.Textbox;
      options.template = BrowseField;

      // TODO: file selector dialog
      options.config = {
        //isFile: type === FieldTypes.FILE_PATH
        isFile: false
      };
      break;
    }
    case API.SettingTypeEnum.HINTED_USER: {
      options.factory = tcomb.form.Textbox;
      options.template = HintedUserSelectField;
      break;
    }
    case API.SettingTypeEnum.HUB_URL: {
      options.factory = tcomb.form.Textbox;
      options.template = HubUrlField;
      break;
    }
    default:
  }

  return options;
};

const parseTitle = (
  definition: UI.FormFieldDefinition,
  formT: UI.ModuleTranslator
) => {
  if (definition.title && definition.optional) {
    return formT.t('fieldOptional', {
      defaultValue: '{{definition.title}} (optional)',
      replace: {
        definition
      }
    });
  }

  return definition.title;
};

const parseFieldOptions = (
  definition: UI.FormFieldDefinition,
  formT: UI.ModuleTranslator,
  titleFormatter: UI.OptionTitleParser = parseTitle
): form.TcombFieldOptions => {
  const options = parseTypeOptions(definition.type);

  // List item options
  if (definition.type === API.SettingTypeEnum.LIST) {
    let itemOptions: form.TcombStructOptions = {};
    // (options as form.TcombListOptions).item = {};
    if (definition.definitions) {
      // Struct item fields
      itemOptions.fields = definition.definitions.reduce(
        (reduced, itemDefinition) => {
          reduced[itemDefinition.key] = parseFieldOptions(itemDefinition, formT, titleFormatter);
          return reduced;
        }, 
        {}
      );
    } else {
      // Plain items
      itemOptions = parseTypeOptions(definition.item_type!);
    }

    options.item = itemOptions;
  }

  // Captions
  options.legend = titleFormatter(definition, formT);
  options.help = definition.help;

  // Enum select field?
  if (definition.options) {
    invariant(
      Array.isArray(definition.options) && definition.options.length > 0, 
      'Incorrect enum options supplied: ' + JSON.stringify(definition.options)
    );

    Object.assign(options, {
      factory: tcomb.form.Select,
      options: definition.options.map(normalizeEnumValue),
      nullOption: false,
    });

    if (definition.type === API.SettingTypeEnum.LIST) {
      options.template = SelectField;
    } else if (definition.options[0].id === parseInt(definition.options[0].id as string, 10)) {
      // Integer keys won't work with the default template, do string conversion
      options.transformer = intTransformer;
    }
  }

  return options;
};


const findFieldByKey = (options: form.TcombStructOptions, wantedKey: string): form.TcombOptions | null => {
  if (options.fields) {
    for (const key of Object.keys(options.fields)) {
      const field = options.fields[key];
      if (key === wantedKey) {
        return field;
      }

      if (field.fields) {
        const subField = findFieldByKey(field, wantedKey);
        if (subField) {
          return subField;
        }
      }
    }
  }

  return null;
};

const findFieldValueByPath = (obj: object, path: string[]): any => {
  const value = obj[path[0]];
  if (value && typeof value === 'object' && path.length > 1) {

    const subPath = [ ...path ];
    subPath.shift();
    return findFieldValueByPath(value, subPath);
  }

  return value;
};

const setFieldValueByPath = (obj: object, newValue: any, path: string[]): any => {
  const curKey = path[0];
  if (path.length > 1) {
    obj[curKey] = obj[curKey] || {};

    const subPath = [ ...path ];
    subPath.shift();
    setFieldValueByPath(obj[curKey], newValue, subPath);
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
    // Object values (structs, hinted users...)
    const settingKeys = Object.keys(currentFormValue[valueKey]!);
    const changedObjectValue = settingKeys.reduce(
      reduceChangedFieldValues.bind(
        null,
        sourceValue[valueKey], 
        currentFormValue[valueKey]
      ), 
      {}
    );

    if (Object.keys(changedObjectValue).length > 0) {
      changedValues[valueKey] = changedObjectValue;
    }
  } else {
    // Lists and simple values
    if (!sourceValue || !formValuesEqual(sourceValue[valueKey], currentFormValue[valueKey])) {
      changedValues[valueKey] = currentFormValue[valueKey];
    }
  }

  return changedValues;
};

const toFormI18nKey = (
  propName: UI.TranslatableFormDefinitionProperties, 
  definitionKey: string,
  extraKeyPostfix: string | undefined
) => {
  let key = textToI18nKey(definitionKey, UI.SubNamespaces.FORM);
  key += propName;
  if (extraKeyPostfix) {
    key += upperFirst(extraKeyPostfix);
  }

  return key;
};

const translateDefinition = (
  def: UI.FormFieldDefinition, 
  moduleT: UI.ModuleTranslator
): UI.FormFieldDefinition => {
  const translateProp = (
    propName: UI.TranslatableFormDefinitionProperties, 
    value: string | undefined, 
    extraKeyPostfix?: string
  ) => {
    if (!value) {
      return undefined;
    }

    const key = toFormI18nKey(propName, def.key, extraKeyPostfix);
    return moduleT.t(key, value);
  };

  const ret = {
    ...def,
    title: translateProp(UI.TranslatableFormDefinitionProperties.NAME, def.title)!,
    help: translateProp(UI.TranslatableFormDefinitionProperties.HELP, def.help),
    options: def.options ? def.options.map(opt => ({
      ...opt,
      name: translateProp(
        UI.TranslatableFormDefinitionProperties.OPTION, 
        opt.name,
        opt.id.toString()
      )!
    })) : undefined,
    definitions: !!def.definitions ? def.definitions.map(subDef => {
      return translateDefinition(subDef, moduleT);
    }) : undefined,
  };

  return ret;
};

const translateForm = (
  definitions: UI.FormFieldDefinition[], 
  moduleT: UI.ModuleTranslator,
): UI.FormFieldDefinition[] => {
  const ret = definitions
    .map(def => {
      return translateDefinition(def, moduleT);
    });

  return ret;
};

const updateMultiselectValues = <ValueT>(values: ValueT[], value: ValueT, checked: boolean) => {
  if (checked) {
    values = [ ...values, value ];
  } else {
    const index = values.indexOf(value);
    values = update(values, { $splice: [ [ index, 1 ] ] });
  }

  return values;
};


export {
  translateForm,
  toFormI18nKey,

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

  findFieldByKey,
  findFieldValueByPath,
  setFieldValueByPath,

  updateMultiselectValues,
  formValuesEqual,
}
;
