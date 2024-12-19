import { useEffect, useState } from 'react';

import * as API from 'types/api';
import * as UI from 'types/ui';

import MenuConstants, { MENU_SUPPORTS } from 'constants/MenuConstants';
import NotificationActions from 'actions/NotificationActions';
import { parseActionMenuItemId, parseActionMenuItemIds } from 'utils/MenuUtils';
import { ActionMenuDefinition } from '../useActionMenuItems';
import { useSocket } from 'context/SocketContext';

export interface RemoteMenuData {
  selectedIds: UI.ActionIdType[];
  remoteMenuId: string;
  entityId: API.IdType | undefined;
}

export interface RemoteMenu {
  menuData: RemoteMenuData;
  items: API.GroupedContextMenuItem[];
}

interface ParsedDefinitionArray {
  remoteMenuIds: Array<string | undefined>;
  selectedIdsByMenu: Array<UI.ActionIdType>[];
  entityIds: Array<API.IdType | undefined>;
}

const parseDefinitionArray = (
  definitionArray: ActionMenuDefinition<any, any>[],
): ParsedDefinitionArray => {
  const selectedIdsByMenu = definitionArray
    .map((defition) => defition.itemData)
    .map((data) => parseActionMenuItemIds(data));
  const remoteMenuIds = definitionArray.map(
    (remoteMenuProps) => remoteMenuProps.remoteMenuId,
  );
  const entityIds = definitionArray
    .map((defition) => defition.entity)
    .map((data) => parseActionMenuItemId(data) as API.IdType | undefined);

  return { selectedIdsByMenu, remoteMenuIds, entityIds };
};

export const useRemoteMenuFetcher = (
  definitionArray: ActionMenuDefinition<any, any>[],
) => {
  const { selectedIdsByMenu, remoteMenuIds, entityIds } =
    parseDefinitionArray(definitionArray);

  const [menusByType, setMenusByType] = useState<
    Array<RemoteMenu | undefined> | undefined
  >(undefined);

  const socket = useSocket();

  useEffect(() => {
    const fetchMenus = async () => {
      const menuPromises = remoteMenuIds.map(async (remoteMenuId, menuIndex) => {
        if (!remoteMenuId) {
          return Promise.resolve(undefined);
        }

        const selectedIds = selectedIdsByMenu[menuIndex];
        const entityId = entityIds[menuIndex];

        const menu = await socket.post<API.GroupedContextMenuItem[]>(
          `${MenuConstants.MODULE_URL}/${remoteMenuId}/list_grouped`,
          {
            selected_ids: selectedIds,
            entity_id: entityId,
            supports: MENU_SUPPORTS,
          },
        );

        return {
          items: menu,
          menuData: {
            remoteMenuId,
            selectedIds,
            entityId,
          },
        };
      });

      let fetchedMenus: Array<RemoteMenu | undefined>;
      try {
        fetchedMenus = await Promise.all(menuPromises);
      } catch (e) {
        NotificationActions.apiError('Failed fetch menu items', e);
        return;
      }

      setMenusByType(fetchedMenus);
    };

    fetchMenus();
  }, []);

  return menusByType;
};
