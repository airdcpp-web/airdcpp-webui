import { LocalSettingDefinitions } from '@/constants/LocalSettingConstants';

import * as UI from '@/types/ui';
import invariant from 'invariant';

// import { loadLocalProperty, saveLocalProperty } from '@/utils/BrowserUtils';

export const getLocalSettingDefinition = (key: string) => {
  const definition = LocalSettingDefinitions.find((def) => def.key === key);
  invariant(definition, `Invalid local setting key ${key} supplied`);
  return definition;
};

export const getLocalSettingDefinitions = (keys: string[]) => {
  return keys.map(getLocalSettingDefinition);
};

export const getLocalSettingValue = <ValueType extends UI.FormValueBase>(
  key: string,
  values: UI.LocalSettingValues,
): ValueType => {
  if (values.hasOwnProperty(key)) {
    return values[key] as ValueType;
  }

  return getLocalSettingDefinition(key).default_value as ValueType;
};

/*export const getLocalSettingValues = (
  keys: string[],
  settings: UI.LocalSettingValues,
) => {
  return keys.map((key) => getLocalSettingValue(key, settings));
};*/

export const getLocalSettingValueMap = (settings: UI.LocalSettingValues) => {
  return LocalSettingDefinitions.reduce((reduced, { key }) => {
    reduced[key] = getLocalSettingValue(key, settings);
    return reduced;
  }, {} as UI.LocalSettingValues);
};
