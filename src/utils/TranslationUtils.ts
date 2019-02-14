import { camelCase } from 'lodash';
import i18next from 'i18next';

import * as UI from 'types/ui';


const parseModules = (moduleIds: string | string[]) => {
  if (typeof moduleIds === 'string') {
    return moduleIds;
  }

  return moduleIds.reduce(
    (reduced, curId) => {
      if (!!reduced.length) {
        reduced += '.';
      }

      return reduced + curId;
    },
    ''
  );
};

export const toI18nKey = (text: string, moduleIds: string | string[]) => {
  let i18nKey = camelCase(text);
  if (UI.SubNamespaces[i18nKey.toUpperCase()]) {
    i18nKey += 'Caption';
  }

  const ret = `${parseModules(moduleIds)}.${i18nKey}`;
  //if (subNamespace) {
  //  ret += `.${subNamespace}`;
  //}

  return ret;
};

export const translate = (text: string, t: i18next.TFunction, moduleId: string | string[]) => {
  return t(toI18nKey(text, moduleId), text);
};

export const getModuleT = (t: i18next.TFunction, moduleId: string /*| string[]*/): UI.ModuleTranslator => {
  const moduleT: i18next.TFunction = (key, options) => {
    return t(toI18nKey(key as string, moduleId), options);
  };

  return {
    t: moduleT,
    toI18nKey: (key: string, subModuleIds?: string[]) => 
      toI18nKey(key, !subModuleIds ? moduleId : [ moduleId, ...subModuleIds ]),
    translate: (text: string, subModuleIds?: string[]) => 
      translate(text, t, !subModuleIds ? moduleId : [ moduleId, ...subModuleIds ]),
  };
};