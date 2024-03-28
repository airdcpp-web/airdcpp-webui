import * as React from 'react';

import { toActionI18nKey } from 'utils/ActionUtils';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { ActionClickHandler, ActionData } from 'decorators/ActionHandlerDecorator';
import { Trans } from 'react-i18next';
import { parseTranslationModules } from 'utils/TranslationUtils';
import { parseActionMenu } from 'utils/MenuUtils';

const getDivider = (menuIndex: number, itemIndex: number) => {
  return {
    id: `divider${menuIndex}_${itemIndex}`,
  };
};

const actionToActionMenuItem = <ItemDataT extends UI.ActionMenuItemDataValueType>(
  action: UI.MenuActionDefition<ItemDataT>,
  menu: UI.ActionMenuType<ItemDataT>,
  onClickAction: ActionClickHandler<ItemDataT>,
) => {
  const active = !action.checked ? false : action.checked(menu.itemDataGetter());
  const icon = !!action.checked ? (active ? 'checkmark' : '') : action.icon;
  return {
    id: action.id,
    item: {
      onClick: () => {
        onClickAction({
          actionId: action.id,
          action,
          itemData: menu.itemDataGetter(),
          moduleId: menu.actions.moduleId,
          subId: menu.actions.subId,
        });
      },
      active,
      icon,
      children: (
        <Trans
          i18nKey={toActionI18nKey(
            action,
            parseTranslationModules(menu.actions.moduleId),
          )}
          defaults={action.displayName}
        >
          {action.displayName}
        </Trans>
      ),
    },
  };
};

// Convert ID to menu link element
const getMenuItem = <ItemDataT extends UI.ActionMenuItemDataValueType>(
  menu: UI.ActionMenuType<ItemDataT>,
  menuIndex: number,
  action: UI.MenuActionListItemType<ItemDataT>,
  itemIndex: number,
  onClickAction: ActionClickHandler<ItemDataT>,
): UI.ActionMenuItem => {
  if (!action) {
    return getDivider(menuIndex, itemIndex);
  }

  if ('children' in action) {
    return {
      id: action.id,
      item: {
        icon: action.icon,
        onClick: () => {
          // ..
        },
        children: <>{action.displayName}</>,
      },
      children: action.children.map((childAction, childActionIndex) => {
        if (!childAction) {
          return getDivider(0, childActionIndex);
        }

        return actionToActionMenuItem(childAction, menu, onClickAction);
      }),
    };
  }

  return actionToActionMenuItem(action, menu, onClickAction);
  /*const active = !action.checked ? false : action.checked(menu.itemDataGetter());
  const icon = !!action.checked ? (active ? 'checkmark' : '') : action.icon;
  return {
    id: actionId,
    item: {
      onClick: () => {
        onClickAction({
          actionId,
          action,
          itemData: menu.itemDataGetter(),
          moduleId: menu.actions.moduleId,
          subId: menu.actions.subId,
        });
      },
      active,
      icon,
      children: (
        <Trans
          i18nKey={toActionI18nKey(
            action,
            parseTranslationModules(menu.actions.moduleId),
          )}
          defaults={action.displayName}
        >
          {action.displayName}
        </Trans>
      ),
    },
  };*/
};

// This should be used only for constructed menus, not for id arrays
const hasLocalItems = <ItemDataT extends UI.ActionMenuItemDataValueType>(
  id: string | UI.ActionMenuType<ItemDataT>,
) => typeof id !== 'string';

export interface ActionMenuDefinition<ItemDataT extends UI.ActionMenuItemDataValueType>
  extends UI.ActionMenuData<ItemDataT> {
  entityId?: API.IdType;
  remoteMenuId?: string;
  children?: React.ReactElement<ActionMenuDefinition<ItemDataT>> | false;
}

export interface ActionMenuDecoratorChildProps {
  items: (onClick?: UI.MenuItemClickHandler) => UI.ActionMenuItem[];
}

export const useActionMenuItems = <ItemDataT extends UI.ActionMenuItemDataValueType>(
  props: ActionMenuDefinition<ItemDataT>,
) => {
  // Reduce menus to an array of DropdownItems
  const reduceLocalMenuItems = (
    onClickAction: ActionClickHandler,
    items: UI.ActionMenuItem[],
    menu: UI.ActionMenuType<ItemDataT>,
    menuIndex: number,
  ) => {
    items.push(
      ...menu.actions.actions.map((actionId, actionIndex) => {
        return getMenuItem(
          menu as UI.ActionMenuType<ItemDataT>,
          menuIndex,
          actionId,
          actionIndex,
          onClickAction,
        );
      }),
    );

    return items;
  };

  // Get nested menus
  const getMenuDefinitionArray = (): ActionMenuDefinition<ItemDataT>[] => {
    const { children } = props;
    const ret: Array<ActionMenuDefinition<ItemDataT>> = [props];
    if (children) {
      React.Children.map(children, (child) => {
        const id = child.props;
        ret.push(id);
      });
    }

    return ret;
  };

  const getMenus = () => {
    return getMenuDefinitionArray().reduce(
      (reduced, cur) => {
        reduced.push(parseActionMenu(cur, !!reduced.length));
        return reduced;
      },
      [] as ReturnType<typeof parseActionMenu>[],
    );
  };

  const reduceRemoteMenuItems = (
    reduced: UI.ActionMenuItem[],
    remoteMenuItems: UI.ActionMenuItem[],
  ) => {
    if (!!remoteMenuItems.length) {
      if (!!reduced.length) {
        reduced.push({
          id: 'remote_divider',
        });
      }

      reduced.push(...remoteMenuItems);
    }

    return reduced;
  };

  const getMenuItems = (
    onClickAction: ActionClickHandler<ItemDataT>,
    remoteMenus: Array<UI.ActionMenuItem[]> | null,
    onClickMenuItem: UI.MenuItemClickHandler | undefined,
  ): UI.ActionMenuItem[] => {
    const menus = getMenus();

    // Local items
    const children = menus.filter(hasLocalItems).reduce((reduced, menu, menuIndex) => {
      const onClickHandler = (action: ActionData<ItemDataT>) => {
        if (!!onClickMenuItem) {
          onClickMenuItem();
        }

        onClickAction(action);
      };

      return reduceLocalMenuItems(
        onClickHandler,
        reduced,
        menu as UI.ActionMenuType<ItemDataT>,
        menuIndex,
      );
    }, [] as UI.ActionMenuItem[]);

    // Remote items (insert after all local items so that the previous menu item positions won't change)
    if (remoteMenus) {
      remoteMenus.reduce(reduceRemoteMenuItems, children);
    }

    return children;
  };

  return { getMenuItems, getMenuDefinitionArray };
};
