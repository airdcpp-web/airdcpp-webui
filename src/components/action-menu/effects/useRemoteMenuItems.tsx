import { useEffect, useState } from 'react';

import * as API from 'types/api';
import * as UI from 'types/ui';

import MenuConstants from 'constants/MenuConstants';
import SocketService from 'services/SocketService';
import NotificationActions from 'actions/NotificationActions';
import { FormSaveHandler } from 'components/form';
import { MenuFormDialogProps } from 'components/action-menu/MenuFormDialog';
import IconConstants from 'constants/IconConstants';

const SUPPORTS = ['urls', 'form'];

interface SelectionData {
  menuItem: API.ContextMenuItem;
  selectedIds: UI.ActionIdType[];
  remoteMenuId: string;
}

type SelectHandler = (selection: SelectionData) => void;

const toMenuItem = (
  selection: SelectionData,
  handleSelect: SelectHandler
): UI.ActionMenuItem => {
  const onClick = () => {
    handleSelect(selection);
  };

  const { id, icon, title } = selection.menuItem;
  return {
    id,
    item: {
      onClick,
      icon: icon[MenuConstants.ICON_TYPE_ID],
      children: title,
    },
  };
};

interface MenuItemData {
  selectedIds: UI.ActionIdType[];
  remoteMenuId: string;
  handleSelect: SelectHandler;
  nestingThreshold: number;
}

const toMenu = (
  menu: API.GroupedContextMenuItem,
  { selectedIds, remoteMenuId, handleSelect, nestingThreshold }: MenuItemData
): UI.ActionMenuItem[] => {
  const items = menu.items.map((menuItem) =>
    toMenuItem(
      {
        menuItem,
        remoteMenuId,
        selectedIds,
      },
      handleSelect
    )
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

export type OnShowRemoteMenuForm = (data: MenuFormDialogProps) => void;

interface RemoteMenuDecoratorProps {
  remoteMenuIds: Array<string | undefined>;
  selectedIds: Array<UI.ActionIdType>[];
  entityId: API.IdType | undefined;
  onShowForm: OnShowRemoteMenuForm;
  nestingThreshold?: number;
  onClickMenuItem?: UI.MenuItemClickHandler;
}

export const useRemoteMenuItems = ({
  remoteMenuIds,
  selectedIds: selectedIdsByMenu,
  entityId,
  onShowForm,
  nestingThreshold = 1,
  onClickMenuItem,
}: RemoteMenuDecoratorProps) => {
  const [menusByType, setMenusByType] = useState<
    Array<API.GroupedContextMenuItem[]> | undefined
  >(undefined);

  useEffect(() => {
    const fetchMenus = async () => {
      const menuPromises = remoteMenuIds.map((remoteMenuId, menuIndex) =>
        !remoteMenuId
          ? []
          : SocketService.post<API.GroupedContextMenuItem[]>(
              `${MenuConstants.MODULE_URL}/${remoteMenuId}/list_grouped`,
              {
                selected_ids: selectedIdsByMenu[menuIndex],
                entity_id: entityId,
                supports: SUPPORTS,
              }
            )
      );

      let fetchedMenus: Array<API.GroupedContextMenuItem[]>;
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

  const onPostSelect = (selection: SelectionData, values?: UI.FormValueMap) => {
    const { menuItem, remoteMenuId, selectedIds } = selection;
    const { id, hook_id } = menuItem;
    return SocketService.post<void>(
      `${MenuConstants.MODULE_URL}/${remoteMenuId}/select`,
      {
        selected_ids: selectedIds,
        hook_id: hook_id,
        menuitem_id: id,
        entity_id: entityId,
        supports: SUPPORTS,
        form_definitions: menuItem.form_definitions,
        form_value: values,
      }
    );
  };

  const onItemSelected = (selection: SelectionData) => {
    if (onClickMenuItem) {
      onClickMenuItem();
    }

    const { menuItem } = selection;
    if (menuItem.urls && menuItem.urls.length > 0) {
      for (const url of menuItem.urls) {
        window.open(url);
      }

      return;
    }

    const formFieldDefinitions = menuItem.form_definitions;
    if (!!formFieldDefinitions && !!formFieldDefinitions.length) {
      const { title, icon } = menuItem;

      const onSave: FormSaveHandler<UI.FormValueMap> = (
        changedFields: UI.FormValueMap,
        allFields: UI.FormValueMap
      ) => {
        return onPostSelect(selection, allFields);
      };

      onShowForm({
        onSave,
        title: title,
        icon: icon[MenuConstants.ICON_TYPE_ID],
        fieldDefinitions: formFieldDefinitions,
      });
    } else {
      onPostSelect(selection);
    }
  };

  // Render the normal menu items for menu height estimation even when the remote items aren't available yet
  const getRemoteItems = (): UI.ActionMenuItem[][] | null =>
    !menusByType
      ? null
      : menusByType.map((groupedMenus, typeIndex) => {
          const remoteMenuId = remoteMenuIds[typeIndex]!;
          const items = groupedMenus.reduce((reduced, groupedMenu) => {
            const menu = toMenu(groupedMenu, {
              remoteMenuId,
              selectedIds: selectedIdsByMenu[typeIndex],
              handleSelect: onItemSelected,
              nestingThreshold,
            });

            return [...reduced, ...menu];
          }, [] as UI.ActionMenuItem[]);

          return items;
        });

  return { getRemoteItems };
};
