import { camelCase } from 'lodash';
import i18next from 'i18next';

//import * as UI from 'types/ui';


export const toI18nKey = (text: string, moduleId?: string) => {
  const i18nKey = camelCase(text);
  return !!moduleId ? `${moduleId}.${i18nKey}` : i18nKey;
};

export const translate = (text: string, t: i18next.TFunction, moduleId?: string) => {
  return t(toI18nKey(text, moduleId), text);
};
