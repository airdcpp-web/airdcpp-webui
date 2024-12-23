import * as UI from 'types/ui';
import { toI18nKey } from './TranslationUtils';

export const parseLoginError = (
  error: UI.TranslatableMessage | string,
  t: UI.TranslateF,
) => {
  if (typeof error === 'string') {
    return error;
  }

  return t(toI18nKey(error.id, UI.Modules.LOGIN), error.message);
};
