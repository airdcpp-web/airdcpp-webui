import React, { useEffect, useState } from 'react';

import * as API from 'types/api';
import * as UI from 'types/ui';

import MenuConstants from 'constants/MenuConstants';
import MenuItemLink from 'components/semantic/MenuItemLink';
import SocketService, { APISocket } from 'services/SocketService';
import { IdType } from 'types/api';
import NotificationActions from 'actions/NotificationActions';


type OnClickHandler = () => void;

const SUPPORTS = [ 'urls' ];

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

        if (menuItem.urls && menuItem.urls.length > 0) {
          for (const url of menuItem.urls) {
            window.open(url);
          }
        } else {
          socket.post(`${MenuConstants.MODULE_URL}/${remoteMenuId}/select`, {
            selected_ids: selectedIds,
            hook_id: menuItem.hook_id,
            menuitem_id: menuItem.id,
            entity_id: entityId,
            supports: SUPPORTS,
          });
        }
      } }
      icon={ menuItem.icon[MenuConstants.ICON_TYPE_ID] }
    >
      { menuItem.title }
    </MenuItemLink>
  );
};


interface RemoteMenuDecoratorProps {
  children: (menuItems: Array<React.ReactChild[]> | null) => React.ReactNode;
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
              entity_id: entityId,
              supports: SUPPORTS,
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

  // Render the normal menu items for menu height estimation even when the remote items aren't available yet
  const ret = !menus ? null : menus
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
