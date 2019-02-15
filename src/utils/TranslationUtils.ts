import { camelCase } from 'lodash';
import invariant from 'invariant';
import i18next from 'i18next';

import * as UI from 'types/ui';


export const parseTranslationModules = (moduleIds: string | string[]) => {
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

export const toI18nKey = (key: string, moduleIds: string | string[], subNamespaces?: string[]) => {
  invariant(key.indexOf(' ') === -1, 'Invalid i18key');
  if (UI.SubNamespaces[key.toUpperCase()] || (subNamespaces && subNamespaces.indexOf(key) !== -1)) {
    key += 'Caption';
  }

  const ret = `${parseTranslationModules(moduleIds)}.${key}`;
  return ret;
};

export const textToI18nKey = (text: string, moduleIds: string | string[], subNamespaces?: string[]) => {
  return toI18nKey(camelCase(text), moduleIds, subNamespaces);
};

export const translate = (
  text: string, 
  t: i18next.TFunction, 
  moduleId: string | string[], 
  subNamespaces?: string[]
) => {
  return t(textToI18nKey(text, moduleId, subNamespaces), text);
};

export const toArray = (moduleId: string | string[]) => {
  return typeof moduleId === 'string' ? [ moduleId ] : moduleId;
};

const concatModules = (toMerge: string | string[] | undefined, moduleId: string | string[]): string | string[] => {
  if (!toMerge) {
    return moduleId;
  }

  return [ ...toArray(moduleId), ...toArray(toMerge) ];
};

export const getModuleT = (
  t: i18next.TFunction, 
  moduleId: string | string[], 
  subNamespaces?: string[]
): UI.ModuleTranslator => {
  return {
    t: (key, options) => {
      return t(toI18nKey(key as string, moduleId, subNamespaces), options);
    },
    toI18nKey: (key: string, subModuleIds?: string | string[]) => 
      toI18nKey(key, concatModules(subModuleIds, moduleId), subNamespaces),
    translate: (text: string, subModuleIds?: string | string[]) => 
      translate(text, t, concatModules(subModuleIds, moduleId), subNamespaces),
    moduleId,
    plainT: t,
  };
};

export const getSubModuleT = (moduleT: UI.ModuleTranslator, moduleId: string | string[], subNamespaces?: string[]) => {
  return getModuleT(moduleT.plainT, [ ...toArray(moduleT.moduleId), ...toArray(moduleId) ], subNamespaces);
};
