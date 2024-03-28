// import invariant from 'invariant';

import { actionFilter, actionAccess } from 'utils/ActionUtils';

import * as UI from 'types/ui';

export const parseItemData = <ItemDataT extends UI.ActionMenuItemDataValueType>(
  itemData: UI.ActionMenuItemDataType<ItemDataT> | undefined,
): ItemDataT | undefined => {
  return itemData instanceof Function ? itemData() : itemData;
};

// Returns true if the provided ID matches the specified filter
const filterItem = <ItemDataT extends UI.ActionMenuItemDataValueType>(
  action: UI.MenuActionDefition<ItemDataT>,
  itemData: UI.ActionMenuItemDataType<ItemDataT>,
  filter: UI.ActionMenuFilterType<ItemDataT>,
) => {
  return filter(action, parseItemData<ItemDataT>(itemData) as ItemDataT);
};

export const isDivider = <ItemDataT>(action: UI.MenuActionListItemType<ItemDataT>) =>
  action === null;

// Get IDs matching the provided filter
const filterItems = <ItemDataT extends UI.ActionMenuItemDataValueType>(
  actions: UI.MenuActionListType<ItemDataT>,
  itemData: UI.ActionMenuItemDataType<ItemDataT>,
  filter: UI.ActionMenuFilterType<ItemDataT>,
): UI.MenuActionListType<ItemDataT> | null => {
  const filteredActions = actions.reduce((reduced, action) => {
    if (!action) {
      return [...reduced, null];
    }

    if ('children' in action) {
      const filteredChildActions = filterItems(
        action.children,
        itemData,
        filter,
      ) as UI.ChildMenuActionListType<ItemDataT>;
      if (!filteredChildActions) {
        return reduced;
      }

      return [...reduced, { ...action, children: filteredChildActions }];
    }

    const filtered = filterItem(action, itemData, filter);
    if (!filtered) {
      return reduced;
    }

    return [...reduced, action];
  }, [] as UI.MenuActionListType<ItemDataT>);

  if (!filteredActions.length || filteredActions.every(isDivider)) {
    return null;
  }

  return filteredActions;
};

const filterExtraDividers = <ItemDataT extends UI.ActionMenuItemDataValueType>(
  actions: UI.MenuActionListType<ItemDataT>,
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

const toMenuActionDefition = <ItemDataT extends UI.ActionMenuItemDataValueType>(
  id: string,
  action: UI.ActionListItemType<ItemDataT>,
): UI.MenuActionListItemType<ItemDataT> => {
  if (!action) {
    return null;
  }

  if ('children' in action) {
    return {
      id,
      ...action,
      children: Object.keys(action.children).map((childActionId) => {
        const childAction = action.children[childActionId];
        if (!childAction) {
          return null;
        }

        return {
          id: childActionId,
          ...childAction,
        };
      }),
    };
  }

  return {
    id,
    ...action,
  };
};

const getRootActions = <ItemDataT extends UI.ActionMenuItemDataValueType>({
  actions: moduleActions,
  ids,
}: UI.ActionMenuData<ItemDataT>): UI.MenuActionListType<ItemDataT> => {
  const menuActions = Object.keys(moduleActions.actions).reduce((reduced, actionId) => {
    if (ids && !ids.includes(actionId)) {
      return reduced;
    }

    const moduleAction = moduleActions.actions[actionId];
    return [...reduced, toMenuActionDefition(actionId, moduleAction)];
  }, [] as UI.MenuActionListType<ItemDataT>);

  return menuActions;
};

// PUBLIC
// Get IDs to display from the specified menu
export const parseActionMenu = <ItemDataT extends UI.ActionMenuItemDataValueType>(
  props: UI.ActionMenuData<ItemDataT>,
  hasPreviousMenuItems: boolean,
): UI.ActionMenuType<ItemDataT> | string => {
  let actions: UI.MenuActionListType<ItemDataT> | null = getRootActions(props);

  // Only return a single error for each menu
  // Note the filtering order (no-access will be preferred over filtered)
  actions = filterItems(actions, props.itemData, actionAccess);
  if (!actions) {
    return 'no-access';
  }

  actions = filterItems(actions, props.itemData, actionFilter);
  if (!actions) {
    return 'filtered';
  }

  // Remove unwanted dividers
  actions = filterExtraDividers(actions);

  // Always add a divider between separate action types
  if (hasPreviousMenuItems) {
    actions = [null, ...actions];
  }

  const ret: UI.ActionMenuType<ItemDataT> = {
    itemDataGetter:
      props.itemData instanceof Function
        ? props.itemData
        : () => props.itemData as ItemDataT,
    actions: {
      ...props.actions,
      actions,
    },
  };

  return ret;
};

// Determine unique ID from item data
export const parseActionMenuItemIds = <ItemDataT extends UI.ActionMenuItemDataValueType>(
  itemData: UI.ActionMenuItemDataType<ItemDataT> | undefined,
): Array<UI.ActionIdType> => {
  const parsedItemData = parseItemData<ItemDataT>(itemData);
  return !!parsedItemData && (parsedItemData as UI.ActionMenuObjectItemData).id
    ? [(parsedItemData as UI.ActionMenuObjectItemData).id]
    : [];
};
