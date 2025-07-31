import * as API from '@/types/api';
import * as UI from '@/types/ui';

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

export const hasAccess = (login: UI.AuthenticatedSession, access: API.AccessEnum) => {
  /*if (!login.session) {
    return false;
  }*/

  const { permissions } = login.user;
  return permissions.includes(access) || permissions.includes(API.AccessEnum.ADMIN);
};
