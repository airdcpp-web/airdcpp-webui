import * as React from 'react';

import { toActionI18nKey } from 'utils/ActionUtils';

import * as UI from 'types/ui';

import { ActionClickHandler, ActionData } from 'decorators/ActionHandlerDecorator';
import { Trans } from 'react-i18next';
import { parseTranslationModules } from 'utils/TranslationUtils';
import { parseActionMenu } from 'utils/MenuUtils';

// Convert ID to menu link element
const getMenuItem = <ItemDataT extends UI.ActionMenuItemDataValueType>(
  menu: UI.ActionMenuType<ItemDataT>,
  menuIndex: number,
  actionId: string,
  itemIndex: number,
  onClickAction: ActionClickHandler<ItemDataT>,
): UI.ActionMenuItem => {
  const action = menu.actions.actions[actionId];
  if (!action) {
    return {
      id: `divider${menuIndex}_${itemIndex}`,
    };
  }

  const active = !action.checked ? false : action.checked(menu.itemDataGetter());
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
  };
};

// This should be used only for constructed menus, not for id arrays
const hasLocalItems = <ItemDataT extends UI.ActionMenuItemDataValueType>(
  id: string | UI.ActionMenuType<ItemDataT>,
) => typeof id !== 'string';

export interface ActionMenuDecoratorProps<
  ItemDataT extends UI.ActionMenuItemDataValueType,
> extends UI.ActionMenuData<ItemDataT> {
  remoteMenuId?: string;
  className?: string;
  caption?: React.ReactNode;
  button?: boolean;
  children?: React.ReactElement<ActionMenuDecoratorProps<ItemDataT>> | false;
}

export interface ActionMenuDecoratorChildProps {
  items: (onClick?: UI.MenuItemClickHandler) => UI.ActionMenuItem[];
}

export const useActionMenuItems = <ItemDataT extends UI.ActionMenuItemDataValueType>(
  props: ActionMenuDecoratorProps<ItemDataT>,
) => {
  // Reduce menus to an array of DropdownItems
  const reduceLocalMenuItems = (
    onClickAction: ActionClickHandler,
    items: UI.ActionMenuItem[],
    menu: UI.ActionMenuType<ItemDataT>,
    menuIndex: number,
  ) => {
    items.push(
      ...menu.actionIds.map((actionId, actionIndex) => {
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
  const getPropsArray = (): ActionMenuDecoratorProps<ItemDataT>[] => {
    const { children } = props;
    const ret: Array<ActionMenuDecoratorProps<ItemDataT>> = [props];
    if (children) {
      React.Children.map(children, (child) => {
        const id = child.props;
        ret.push(id);
      });
    }

    return ret;
  };

  const getMenus = () => {
    return getPropsArray().reduce(
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

  const getItems = (
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

  return { getItems, getPropsArray };
};
