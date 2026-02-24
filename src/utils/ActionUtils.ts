import invariant from 'invariant';

import * as UI from '@/types/ui';

import { textToI18nKey, toArray, translate } from './TranslationUtils';
import NotificationActions from '@/actions/NotificationActions';
import { hasAccess } from './AuthUtils';

export const actionFilter = <
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType,
>(
  action: UI.ActionDefinition<ItemDataT, EntityT>,
  itemData?: ItemDataT,
  entity?: EntityT,
) => {
  return (
    !itemData || !action.filter || action.filter({ itemData, entity: entity as EntityT })
  );
};

export const actionAccess = <ItemDataT extends UI.ActionDataValueType>(
  action: Pick<UI.ActionDefinition<ItemDataT>, 'access'>,
  session: UI.AuthenticatedSession,
) => {
  return !action.access || hasAccess(session, action.access);
};

export const showAction = <
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType,
>(
  action: UI.ActionDefinition<ItemDataT, EntityT>,
  itemData: ItemDataT | undefined,
  login: UI.AuthenticatedSession,
) => {
  return actionFilter(action, itemData) && actionAccess(action, login);
};

// Check if an action should be shown in bulk selection mode
export const showBulkAction = <
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType,
>(
  action: UI.ActionDefinition<ItemDataT, EntityT>,
  items: ItemDataT[],
  session: UI.AuthenticatedSession,
): boolean => {
  // Must have bulk enabled
  if (!action.bulk?.enabled) {
    return false;
  }

  // Check access permissions
  if (!actionAccess(action, session)) {
    return false;
  }

  // Check max items constraint
  if (action.bulk.maxItems && items.length > action.bulk.maxItems) {
    return false;
  }

  // Check bulk filter if present
  if (action.bulk.filter) {
    return action.bulk.filter({ itemData: items, entity: undefined as EntityT });
  }

  // Fallback: all items must pass individual filter
  if (action.filter) {
    return items.every((item) =>
      action.filter!({ itemData: item, entity: undefined as EntityT }),
    );
  }

  return true;
};

export const toActionI18nKey = (
  action: UI.ActionDefinition<any, any>,
  moduleId: string | string[],
) => {
  invariant(!!action.displayName, 'Invalid action');
  return textToI18nKey(action.displayName, [
    ...toArray(moduleId),
    UI.SubNamespaces.ACTIONS,
  ]);
};

export const translateActionName = (
  action: UI.ActionDefinition<any, any>,
  moduleData: UI.ActionModuleData,
  t: UI.TranslateF,
) => {
  return t(toActionI18nKey(action, moduleData.moduleId), action.displayName);
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
