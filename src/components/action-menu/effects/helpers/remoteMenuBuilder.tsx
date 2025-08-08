import * as API from '@/types/api';
import * as UI from '@/types/ui';

import MenuConstants from '@/constants/MenuConstants';
import IconConstants from '@/constants/IconConstants';
import { RemoteMenu, RemoteMenuData } from './remoteMenuFetcher';
import { UILogger } from '@/effects/LoggerEffect';

export interface CombinedContextMenuItem {
  typeData: RemoteMenuData;
  item: API.ContextMenuItem;
}

export interface CombinedContextMenu extends Omit<API.GroupedContextMenu, 'items'> {
  items: CombinedContextMenuItem[];
}

interface MenuOptions {
  handleSelect: SelectHandler;
  nestingThreshold: number;
}

type SelectHandler = (
  menuItem: API.ContextMenuItem,
  remoteMenuData: RemoteMenuData,
) => void;

const toMenuItem = (
  menuItem: API.ContextMenuItem,
  remoteMenuData: RemoteMenuData,
  handleSelect: SelectHandler,
): UI.ActionMenuItem => {
  const onClick = () => {
    handleSelect(menuItem, remoteMenuData);
  };

  const { id, icon, title } = menuItem;
  return {
    id,
    item: {
      onClick,
      icon: icon[MenuConstants.ICON_TYPE_ID],
      children: title,
    },
  };
};

export const remoteMenuToActionMenuItems = (
  menu: CombinedContextMenu,
  { handleSelect, nestingThreshold }: MenuOptions,
): UI.ActionMenuItem[] => {
  const items = menu.items.map(({ item, typeData }) =>
    toMenuItem(item, typeData, handleSelect),
  );

  if (items.length <= nestingThreshold) {
    return items;
  }

  return [
    {
      id: menu.id,
      item: {
        icon: menu.icon[MenuConstants.ICON_TYPE_ID] || IconConstants.EXTENSION,
        onClick: () => {
          // ..
        },
        children: <>{menu.title}</>,
      },
      children: items,
    },
  ];
};

// Combine menus by their subscriber ID and remove duplicate items
export const createRemoteMenuCombineReducer = (logger: UILogger) => {
  return (reduced: CombinedContextMenu[], typeMenus: RemoteMenu | undefined) => {
    if (!typeMenus) {
      return reduced;
    }

    for (const menu of typeMenus.menus) {
      const existing = reduced.find((m) => m.id === menu.id);

      const toMenuItem = (item: API.ContextMenuItem): CombinedContextMenuItem => ({
        typeData: typeMenus.typeData,
        item,
      });

      if (existing) {
        existing.items.push(
          ...menu.items
            .filter((item) => {
              const existingItem = existing.items.find(
                (existingItem) =>
                  existingItem.item.id === item.id &&
                  existingItem.item.hook_id === item.hook_id,
              );
              if (existingItem) {
                logger.info(
                  // eslint-disable-next-line max-len
                  `Removing a duplicate item ${item.id} (subscriber ${menu.id}) from menu ${typeMenus.typeData.remoteMenuId} (exists for menu ${existingItem.typeData.remoteMenuId})`,
                );
              }

              return !existingItem;
            })
            .map(toMenuItem),
        );
      } else {
        reduced.push({
          ...menu,
          items: menu.items.map(toMenuItem),
        });
      }
    }

    return reduced;
  };
};
