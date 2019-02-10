import LoginStore from 'stores/LoginStore';
import invariant from 'invariant';
import { camelCase } from 'lodash';

import * as UI from 'types/ui';


export const actionFilter = (action: UI.ActionType, itemData?: UI.ActionItemDataValueType) => {
  return !itemData || !action.filter || action.filter(itemData);
};

export const actionAccess = (action: UI.ActionType) => {
  invariant(
    !action.hasOwnProperty('access') || action.access, 
    'Invalid access supplied for an action ' + action.displayName
  );
  
  return !action.access || LoginStore.hasAccess(action.access);
};

export const showAction = (action: UI.ActionType, itemData?: UI.ActionItemDataValueType) => {
  return actionFilter(action, itemData) && actionAccess(action);
};

export const getActionCaptionKey = (action: UI.ActionType, moduleId: string) => {
  return `${moduleId}.actions.${camelCase(action.displayName)}`;
};
