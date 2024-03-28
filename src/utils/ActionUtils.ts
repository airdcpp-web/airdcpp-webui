import LoginStore from 'stores/LoginStore';
import invariant from 'invariant';

import * as UI from 'types/ui';

import { textToI18nKey, toArray, translate } from './TranslationUtils';
import NotificationActions from 'actions/NotificationActions';

export const actionFilter = <ItemDataT>(
  action: UI.ActionDefinition<ItemDataT>,
  itemData?: ItemDataT,
) => {
  return !itemData || !action.filter || action.filter(itemData);
};

export const actionAccess = <ItemDataT>(
  action: Pick<UI.ActionDefinition<ItemDataT>, 'access'>,
) => {
  //invariant(
  //  !action.hasOwnProperty('access') || action.access,
  //  `Invalid access supplied for an action ${action.displayName}`
  //);

  return !action.access || LoginStore.hasAccess(action.access);
};

export const showAction = <ItemDataT>(
  action: UI.ActionDefinition<ItemDataT>,
  itemData?: ItemDataT,
) => {
  return actionFilter(action, itemData) && actionAccess(action);
};

export const toActionI18nKey = <ItemDataT>(
  action: UI.ActionDefinition<ItemDataT>,
  moduleId: string | string[],
) => {
  invariant(!!action.displayName, 'Invalid action');
  return textToI18nKey(action.displayName!, [
    ...toArray(moduleId),
    UI.SubNamespaces.ACTIONS,
  ]);
};

type SocketActionHandler = () => Promise<any>;

export const runBackgroundSocketAction = (
  handler: SocketActionHandler,
  t: UI.TranslateF,
): Promise<any> => {
  return handler().catch((e) => {
    NotificationActions.apiError(translate('Action failed', t, UI.Modules.COMMON), e);
  });
};
