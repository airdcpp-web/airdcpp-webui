import invariant from 'invariant';

import * as UI from 'types/ui';

import { textToI18nKey, toArray, translate } from './TranslationUtils';
import NotificationActions from 'actions/NotificationActions';

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
  { hasAccess }: UI.AuthenticatedSession,
) => {
  return !action.access || hasAccess(action.access);
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
