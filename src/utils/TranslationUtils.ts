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

export const toI18nKey = (key: string, moduleIds: string | string[], reservedSubNamespaces?: string[]) => {
  invariant(key.indexOf(' ') === -1, 'Invalid i18key');
  if (UI.SubNamespaces[key.toUpperCase()] || (reservedSubNamespaces && reservedSubNamespaces.indexOf(key) !== -1)) {
    key += 'Caption';
  }

  const ret = `${parseTranslationModules(moduleIds)}.${key}`;
  return ret;
};

export const textToI18nKey = (text: string, moduleIds: string | string[], reservedSubNamespaces?: string[]) => {
  return toI18nKey(camelCase(text), moduleIds, reservedSubNamespaces);
};

export const translate = (
  text: string, 
  t: i18next.TFunction, 
  moduleId: string | string[], 
  reservedSubNamespaces?: string[]
) => {
  return t(textToI18nKey(text, moduleId, reservedSubNamespaces), text);
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
  reservedSubNamespaces?: string[]
): UI.ModuleTranslator => {
  return {
    t: (key, options) => {
      return t(toI18nKey(key as string, moduleId, reservedSubNamespaces), options);
    },
    toI18nKey: (key: string, subModuleIds?: string | string[]) => 
      toI18nKey(key, concatModules(subModuleIds, moduleId), reservedSubNamespaces),
    translate: (text: string, subModuleIds?: string | string[]) => 
      translate(text, t, concatModules(subModuleIds, moduleId), reservedSubNamespaces),
    moduleId,
    plainT: t,
  };
};

export const getSubModuleT = (
  moduleT: UI.ModuleTranslator, 
  moduleId: string | string[], 
  reservedSubNamespaces?: string[]
) => {
  return getModuleT(moduleT.plainT, [ ...toArray(moduleT.moduleId), ...toArray(moduleId) ], reservedSubNamespaces);
};
