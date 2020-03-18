import React, { useEffect, useState } from 'react';

import * as API from 'types/api';
import * as UI from 'types/ui';

import MenuConstants from 'constants/MenuConstants';
import MenuItemLink from 'components/semantic/MenuItemLink';
import SocketService, { APISocket } from 'services/SocketService';
import { IdType } from 'types/api';
import NotificationActions from 'actions/NotificationActions';


type OnClickHandler = () => void;

const toMenuItem = (
  menuItem: API.ContextMenuItem, 
  remoteMenuId: string,
  selectedIds: UI.ActionIdType[], 
  socket: APISocket,
  onClick: OnClickHandler | undefined,
  entityId: IdType | undefined
) => {
  return (
    <MenuItemLink
      key={ menuItem.id } 
      onClick={ () => {
        if (onClick) {
          onClick();
        }

        socket.post(`${MenuConstants.MODULE_URL}/${remoteMenuId}/select`, {
          selected_ids: selectedIds,
          hook_id: menuItem.hook_id,
          menuitem_id: menuItem.id,
          entity_id: entityId,
        });
      } }
      icon={ menuItem.icon }
    >
      { menuItem.title }
    </MenuItemLink>
  );
};


interface RemoteMenuDecoratorProps {
  children: (menuItems: Array<React.ReactChild[]>) => React.ReactNode;
  remoteMenuIds: Array<string | undefined>;
  onClickMenuItem?: OnClickHandler;
  selectedIds: Array<UI.ActionIdType>[];
  entityId: IdType | undefined;
}

type Props = RemoteMenuDecoratorProps /*& ApiMenuDecoratorDataProps & DataProviderDecoratorChildProps*/;

const RemoteMenuDecorator: React.FC<Props> = ({
  remoteMenuIds, selectedIds, children, onClickMenuItem, entityId
}) => {
  const [ menus, setMenus ] = useState<(Array<API.ContextMenuItem>)[] | undefined>(undefined);

  useEffect(
    () => {
      const fetchMenus = async () => {
        const menuPromises = remoteMenuIds
          .map((remoteMenuId, menuIndex) => !remoteMenuId ? [] : 
            SocketService.post<API.ContextMenuItem[]>(`${MenuConstants.MODULE_URL}/${remoteMenuId}/list`, {
              selected_ids: selectedIds[menuIndex],
              entity_id: entityId
            })
          );

        let fetchedMenus: API.ContextMenuItem[][];
        try {
          fetchedMenus = await Promise.all(menuPromises);
        } catch (e) {
          NotificationActions.apiError('Failed fetch menu items', e);
          return;
        }

        setMenus(fetchedMenus);
      };

      fetchMenus();
    },
    []
  );

  if (!menus) {
    return null;
  }

  const ret = menus
    .map((menu, menuIndex) => {
      const remoteMenuId = remoteMenuIds[menuIndex];
      if (!remoteMenuId) {
        return [];
      }

      return menu
        .map(menuItem => 
          toMenuItem(menuItem, remoteMenuId, selectedIds[menuIndex], SocketService, onClickMenuItem, entityId));
    });

  return (
    <>
      { children(ret) }
    </>
  );
};

export default RemoteMenuDecorator;
