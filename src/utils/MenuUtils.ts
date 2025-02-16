import { actionFilter, actionAccess } from 'utils/ActionUtils';

import * as UI from 'types/ui';

export const parseItemData = <ItemDataT extends UI.ActionMenuItemDataValueType>(
  itemData: UI.ActionMenuItemDataType<ItemDataT> | undefined,
): ItemDataT | undefined => {
  return itemData instanceof Function ? itemData() : itemData;
};

// Returns true if the provided ID matches the specified filter
const filterItem = <
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
>(
  action: UI.MenuActionDefition<ItemDataT, EntityT>,
  itemData: UI.ActionMenuItemDataType<ItemDataT>,
  entity: EntityT,
  filter: UI.ActionMenuFilterType<ItemDataT, EntityT>,
) => {
  return filter(action, parseItemData<ItemDataT>(itemData) as ItemDataT, entity);
};

export const isDivider = (action: UI.MenuActionListItemType<any, any>) => action === null;

// Get IDs matching the provided filter
const filterItems = <
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
>(
  actions: UI.MenuActionListType<ItemDataT, EntityT>,
  itemData: UI.ActionMenuItemDataType<ItemDataT>,
  entity: EntityT,
  filter: UI.ActionMenuFilterType<ItemDataT, EntityT>,
): UI.MenuActionListType<ItemDataT, EntityT> | null => {
  const filteredActions = actions.reduce(
    (reduced, action) => {
      if (!action) {
        return [...reduced, null];
      }

      if ('children' in action) {
        const filteredChildActions = filterItems(
          action.children,
          itemData,
          entity,
          filter,
        ) as UI.ChildMenuActionListType<ItemDataT, EntityT>;
        if (!filteredChildActions) {
          return reduced;
        }

        return [...reduced, { ...action, children: filteredChildActions }];
      }

      const filtered = filterItem(action, itemData, entity, filter);
      if (!filtered) {
        return reduced;
      }

      return [...reduced, action];
    },
    [] as UI.MenuActionListType<ItemDataT, EntityT>,
  );

  if (!filteredActions.length || filteredActions.every(isDivider)) {
    return null;
  }

  return filteredActions;
};

const filterExtraDividers = <
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
>(
  actions: UI.MenuActionListType<ItemDataT, EntityT>,
) => {
  return actions.filter((item, pos) => {
    if (!isDivider(item)) {
      return true;
    }

    // The first or last element can't be a divider
    if (pos === 0 || pos === actions.length - 1) {
      return false;
    }

    // Check if the next element is also a divider
    // (the last one would always be removed in the previous check)
    return !isDivider(actions[pos + 1]);
  });
};

const toMenuActionDefition = <
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
>(
  action: UI.ActionListItemType<ItemDataT, EntityT>,
): UI.MenuActionListItemType<ItemDataT, EntityT> => {
  if (!action) {
    return null;
  }

  if ('children' in action) {
    return {
      ...action,
      children: Object.keys(action.children).map((childActionId) => {
        const childAction = action.children[childActionId];
        if (!childAction) {
          return null;
        }

        return childAction;
      }),
    };
  }

  return action;
};

const getRootActions = <
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
>({
  actions: moduleActions,
  ids,
}: UI.ActionMenuData<ItemDataT, EntityT>): UI.MenuActionListType<ItemDataT, EntityT> => {
  const menuActions = Object.keys(moduleActions.actions).reduce(
    (reduced, actionId) => {
      if (ids && !ids.includes(actionId)) {
        return reduced;
      }

      const moduleAction = moduleActions.actions[actionId];
      return [...reduced, toMenuActionDefition(moduleAction)];
    },
    [] as UI.MenuActionListType<ItemDataT, EntityT>,
  );

  return menuActions;
};

// PUBLIC
// Get IDs to display from the specified menu
export const parseActionMenu = <
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
>(
  props: UI.ActionMenuData<ItemDataT, EntityT>,
  hasPreviousMenuItems: boolean,
  session: UI.AuthenticatedSession,
): UI.ActionMenuType<ItemDataT, EntityT> | string => {
  let actions: UI.MenuActionListType<ItemDataT, EntityT> | null = getRootActions(props);

  // Only return a single error for each menu
  // Note the filtering order (no-access will be preferred over filtered)
  actions = filterItems(actions, props.itemData, props.entity, (action) =>
    actionAccess(action, session),
  );
  if (!actions) {
    return 'no-access';
  }

  actions = filterItems(actions, props.itemData, props.entity, actionFilter);
  if (!actions) {
    return 'filtered';
  }

  // Remove unwanted dividers
  actions = filterExtraDividers(actions);

  // Always add a divider between separate action types
  if (hasPreviousMenuItems) {
    actions = [null, ...actions];
  }

  const ret: UI.ActionMenuType<ItemDataT, EntityT> = {
    itemDataGetter:
      props.itemData instanceof Function
        ? props.itemData
        : () => props.itemData as ItemDataT,
    moduleData: props.actions.moduleData,
    actions,
    entity: props.entity as EntityT,
  };

  return ret;
};

// Determine unique ID from item data
export const parseActionMenuItemId = <ItemDataT extends UI.ActionMenuItemDataValueType>(
  itemData: UI.ActionMenuItemDataType<ItemDataT> | undefined,
): UI.ActionIdType | undefined => {
  const parsedItemData = parseItemData<ItemDataT>(itemData);
  if (!parsedItemData) {
    return undefined;
  }

  const objectId = (parsedItemData as UI.ActionMenuObjectItemData).id;
  return objectId || parsedItemData;
};

export const parseActionMenuItemIds = <ItemDataT extends UI.ActionMenuItemDataValueType>(
  itemData: UI.ActionMenuItemDataType<ItemDataT> | undefined,
): Array<UI.ActionIdType> => {
  const parsedId = parseActionMenuItemId<ItemDataT>(itemData);
  return !!parsedId ? [parsedId] : [];
};
