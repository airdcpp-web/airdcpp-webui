import * as API from 'types/api';
import * as UI from 'types/ui';

import MenuConstants from 'constants/MenuConstants';
import IconConstants from 'constants/IconConstants';
import { RemoteMenuData } from './remoteMenuFetcher';

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
  menu: API.GroupedContextMenuItem,
  menuData: RemoteMenuData,
  { handleSelect, nestingThreshold }: MenuOptions,
): UI.ActionMenuItem[] => {
  const items = menu.items.map((menuItem) =>
    toMenuItem(menuItem, menuData, handleSelect),
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
