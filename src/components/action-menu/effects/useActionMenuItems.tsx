import * as React from 'react';

import * as UI from '@/types/ui';

import { ActionClickHandler } from '@/decorators/ActionHandlerDecorator';
import { parseActionMenu } from '@/utils/MenuUtils';
import { localMenuToActionMenuItems } from './helpers/localMenuBuilder';
import { ActionData } from '@/decorators/components/ActionDialog';
import { useSession } from '@/context/AppStoreContext';

// This should be used only for constructed menus, not for id arrays
const hasLocalItems = <
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
>(
  id: string | UI.ActionMenuType<ItemDataT, EntityT>,
) => typeof id !== 'string';

export interface ActionMenuDefinition<
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
> extends UI.ActionMenuData<ItemDataT, EntityT> {
  remoteMenuId?: string;
  children?: React.ReactElement<ActionMenuDefinition<ItemDataT, EntityT>> | false;
}

export interface ActionMenuDecoratorChildProps {
  items: (onClick?: UI.MenuItemClickHandler) => UI.ActionMenuItem[];
}

export const useActionMenuItems = <
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
>(
  props: ActionMenuDefinition<ItemDataT, EntityT>,
) => {
  const login = useSession();

  // Get nested menus
  const getMenuDefinitionArray = (): ActionMenuDefinition<ItemDataT, EntityT>[] => {
    const { children } = props;
    const ret: Array<ActionMenuDefinition<ItemDataT, EntityT>> = [props];
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
        reduced.push(parseActionMenu(cur, !!reduced.length, login));
        return reduced;
      },
      [] as ReturnType<typeof parseActionMenu>[],
    );
  };

  const reduceRemoteMenuItems = (
    reduced: UI.ActionMenuItem[],
    remoteMenuItem: UI.ActionMenuItem,
  ) => {
    if (!!reduced.length) {
      reduced.push({
        id: 'remote_divider',
      });
    }

    reduced.push(remoteMenuItem);

    return reduced;
  };

  const getMenuItems = (
    onClickAction: ActionClickHandler<ItemDataT, EntityT>,
    remoteMenus: UI.ActionMenuItem[] | null,
    onClickMenuItem: UI.MenuItemClickHandler | undefined,
  ): UI.ActionMenuItem[] => {
    const menus = getMenus();

    // Local items
    let children = menus.filter(hasLocalItems).reduce((reduced, menu, menuIndex) => {
      const onClickHandler = (action: ActionData<ItemDataT, EntityT>) => {
        if (!!onClickMenuItem) {
          onClickMenuItem();
        }

        onClickAction(action);
      };

      const menuItems = localMenuToActionMenuItems(
        onClickHandler,
        menu as UI.ActionMenuType<ItemDataT, EntityT>,
        menuIndex,
      );

      return [...reduced, ...menuItems];
    }, [] as UI.ActionMenuItem[]);

    // Remote items (insert after all local items so that the previous menu item positions won't change)
    if (remoteMenus) {
      children = remoteMenus.reduce(reduceRemoteMenuItems, children);
    }

    return children;
  };

  return { getMenuItems, getMenuDefinitionArray };
};
