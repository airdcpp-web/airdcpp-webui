import { toActionI18nKey } from '@/utils/ActionUtils';

import * as UI from '@/types/ui';

import { ActionClickHandler } from '@/decorators/ActionHandlerDecorator';
import { parseTranslationModules } from '@/utils/TranslationUtils';

const getDivider = (menuIndex: number, itemIndex: number) => {
  return {
    id: `divider${menuIndex}_${itemIndex}`,
  };
};

const actionToActionMenuItem = <
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
>(
  action: UI.MenuActionDefition<ItemDataT, EntityT>,
  menu: UI.ActionMenuType<ItemDataT, EntityT>,
  onClickAction: ActionClickHandler<ItemDataT, EntityT>,
  t: UI.TranslateF,
) => {
  const active = !action.checked ? false : action.checked(menu.itemDataGetter());
  const icon = !!action.checked ? (active ? 'checkmark' : '') : action.icon;
  const i18nKey = toActionI18nKey(
    action,
    parseTranslationModules(menu.moduleData.moduleId), // TODO: nest under subId
  );
  return {
    id: action.id,
    item: {
      onClick: () => {
        onClickAction({
          action,
          itemData: menu.itemDataGetter(),
          entity: menu.entity,
          moduleData: menu.moduleData,
        });
      },
      active,
      icon,
      children: t(i18nKey, action.displayName),
    },
  };
};

// Convert ID to menu link element
const getMenuItem = <
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
>(
  menu: UI.ActionMenuType<ItemDataT, EntityT>,
  menuIndex: number,
  action: UI.MenuActionListItemType<ItemDataT, EntityT>,
  itemIndex: number,
  onClickAction: ActionClickHandler<ItemDataT, EntityT>,
  t: UI.TranslateF,
): UI.ActionMenuItem => {
  if (!action) {
    return getDivider(menuIndex, itemIndex);
  }

  if ('children' in action) {
    const children = action.children.map((childAction, childActionIndex) => {
      if (!childAction) {
        return getDivider(0, childActionIndex);
      }

      return actionToActionMenuItem(childAction, menu, onClickAction, t);
    });

    if (children.length === 1) {
      return children[0];
    }

    return {
      id: action.id,
      item: {
        icon: action.icon,
        onClick: () => {
          // ..
        },
        children: action.displayName,
      },
      children,
    };
  }

  return actionToActionMenuItem(action, menu, onClickAction, t);
};

export const localMenuToActionMenuItems = <
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
>(
  onClickAction: ActionClickHandler<ItemDataT, EntityT>,
  menu: UI.ActionMenuType<ItemDataT, EntityT>,
  menuIndex: number,
  t: UI.TranslateF,
) => {
  const items = menu.actions.map((actionId, actionIndex) => {
    return getMenuItem(
      menu as UI.ActionMenuType<ItemDataT, EntityT>,
      menuIndex,
      actionId,
      actionIndex,
      onClickAction,
      t,
    );
  });

  return items;
};
