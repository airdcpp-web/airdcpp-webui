import LoginStore from 'stores/LoginStore';
import invariant from 'invariant';

import * as UI from 'types/ui';
import { textToI18nKey, toArray } from './TranslationUtils';


export const actionFilter = <ItemDataT>(action: UI.ActionType<ItemDataT>, itemData?: ItemDataT) => {
  return !itemData || !action.filter || action.filter(itemData);
};

export const actionAccess = <ItemDataT>(action: UI.ActionType<ItemDataT>) => {
  invariant(
    !action.hasOwnProperty('access') || action.access, 
    'Invalid access supplied for an action ' + action.displayName
  );
  
  return !action.access || LoginStore.hasAccess(action.access);
};

export const showAction = <ItemDataT>(action: UI.ActionType<ItemDataT>, itemData?: ItemDataT) => {
  return actionFilter(action, itemData) && actionAccess(action);
};

export const toActionI18nKey = <ItemDataT>(action: UI.ActionType<ItemDataT>, moduleId: string | string[]) => {
  invariant(!!action.displayName, 'Invalid action');
  return textToI18nKey(action.displayName!, [ ...toArray(moduleId), UI.SubNamespaces.ACTIONS ]);
};
