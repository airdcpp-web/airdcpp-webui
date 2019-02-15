import { camelCase } from 'lodash';
import invariant from 'invariant';
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

export const toI18nKey = (key: string, moduleIds: string | string[]) => {
  invariant(key.indexOf(' ') === -1, 'Invalid i18key');
  if (UI.SubNamespaces[key.toUpperCase()]) {
    key += 'Caption';
  }

  const ret = `${parseModules(moduleIds)}.${key}`;
  return ret;
};

export const textToI18nKey = (text: string, moduleIds: string | string[]) => {
  return toI18nKey(camelCase(text), moduleIds);
};

export const translate = (text: string, t: i18next.TFunction, moduleId: string | string[]) => {
  return t(textToI18nKey(text, moduleId), text);
};

const toArray = (moduleId: string | string[]) => {
  return typeof moduleId === 'string' ? [ moduleId ] : moduleId;
};

const concatModules = (toMerge: string | string[] | undefined, moduleId: string | string[]): string | string[] => {
  if (!toMerge) {
    return moduleId;
  }

  return [ ...toArray(moduleId), ...toArray(toMerge) ];
};

export const getModuleT = (t: i18next.TFunction, moduleId: string | string[]): UI.ModuleTranslator => {
  const moduleT: i18next.TFunction = (key, options) => {
    return t(toI18nKey(key as string, moduleId), options);
  };

  return {
    t: moduleT,
    toI18nKey: (key: string, subModuleIds?: string | string[]) => 
      toI18nKey(key, concatModules(subModuleIds, moduleId)),
    translate: (text: string, subModuleIds?: string | string[]) => 
      translate(text, t, concatModules(subModuleIds, moduleId)),
    moduleId,
    plainT: t,
  };
};

export const getSubModuleT = (moduleT: UI.ModuleTranslator, moduleId: string | string[]) => {
  return getModuleT(moduleT.plainT, [ ...toArray(moduleT.moduleId), ...toArray(moduleId) ]);
};
