import invariant from 'invariant';

import { actionFilter, actionAccess } from 'utils/ActionUtils';

import * as UI from 'types/ui';


const parseItemData = <ItemDataT extends UI.ActionMenuItemDataValueType>(
  itemData: UI.ActionMenuItemDataType<ItemDataT> | undefined
): ItemDataT | undefined => {
  return itemData instanceof Function ? itemData() : itemData;
};

// Returns true if the provided ID matches the specified filter
const filterItem = <ItemDataT extends UI.ActionMenuItemDataValueType>(
  props: UI.ActionMenuData<ItemDataT>, 
  filter: UI.ActionMenuFilterType<ItemDataT>, 
  actionId: string
) => {
  const action = props.actions.actions[actionId];
  if (!action) {
    invariant(actionId === 'divider', 'No action for action ID: ' + actionId);
    return true;
  }

  return filter(action, parseItemData<ItemDataT>(props.itemData) as ItemDataT);
};

const isDivider = (id: string) => id.startsWith('divider');

// Get IDs matching the provided filter
const filterItems = <ItemDataT extends UI.ActionMenuItemDataValueType>(
  props: UI.ActionMenuData<ItemDataT>, 
  filter: UI.ActionMenuFilterType<ItemDataT>, 
  actionIds: string[]
) => {
  const ids = actionIds.filter(id =>  filterItem(props, filter, id));
  if (!ids.length || ids.every(isDivider)) {
    return null;
  }

  return ids;
};

const filterExtraDividers = (ids: string[]) => {
  return ids.filter((item, pos) => {
    if (!isDivider(item)) {
      return true;
    }

    // The first or last element can't be a divider
    if (pos === 0 || pos === ids.length - 1) {
      return false;
    }

    // Check if the next element is also a divider 
    // (the last one would always be removed in the previous check)
    return !isDivider(ids[pos + 1]);
  });
};


// PUBLIC
// Get IDs to display from the specified menu
export const parseActionMenu = <ItemDataT extends UI.ActionMenuItemDataValueType>(
  props: UI.ActionMenuData<ItemDataT>, 
  hasPreviousMenuItems: boolean
): UI.ActionMenuType<ItemDataT> | string => {
  let ids: string[] | null;
  ids = props.ids || Object.keys(props.actions.actions).filter(id => {
    const action = props.actions.actions[id];
    return !action || action.displayName;
  });

  // Only return a single error for each menu
  // Note the filtering order (no-access will be preferred over filtered)
  ids = filterItems(props, actionAccess, ids);
  if (!ids) {
    return 'no-access';
  }

  ids = filterItems(props, actionFilter, ids);
  if (!ids) {
    return 'filtered';
  }

  // Remove unwanted dividers
  ids = filterExtraDividers(ids);

  // Always add a divider before submenus
  if (hasPreviousMenuItems) {
    ids = [ 'divider', ...ids ];
  }

  const ret: UI.ActionMenuType<ItemDataT> = {
    actionIds: ids,
    itemDataGetter: props.itemData instanceof Function ? props.itemData : () => props.itemData as ItemDataT,
    actions: props.actions,
  };

  return ret;
};


// Determine unique ID from item data
export const parseActionMenuItemIds = <ItemDataT extends UI.ActionMenuItemDataValueType>(
  itemData: UI.ActionMenuItemDataType<ItemDataT> | undefined
): Array<UI.ActionIdType> => {
  const parsedItemData = parseItemData<ItemDataT>(itemData);
  return !!parsedItemData && (parsedItemData as UI.ActionMenuObjectItemData).id ? 
    [ (parsedItemData as UI.ActionMenuObjectItemData).id ] : 
    [];
};
