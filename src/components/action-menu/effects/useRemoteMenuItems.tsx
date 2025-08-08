import * as API from '@/types/api';
import * as UI from '@/types/ui';

import MenuConstants, { MENU_SUPPORTS } from '@/constants/MenuConstants';
import { FormSaveHandler } from '@/components/form';
import { MenuFormDialogProps } from '@/components/action-menu/MenuFormDialog';
import { ActionMenuDefinition } from './useActionMenuItems';
import { RemoteMenuData, useRemoteMenuFetcher } from './helpers/remoteMenuFetcher';
import {
  CombinedContextMenu,
  createRemoteMenuCombineReducer,
  remoteMenuToActionMenuItems,
} from './helpers/remoteMenuBuilder';
import { useSocket } from '@/context/SocketContext';

export type OnShowRemoteMenuForm = (data: MenuFormDialogProps) => void;

interface RemoteMenuDecoratorProps {
  onShowForm: OnShowRemoteMenuForm;
  nestingThreshold?: number;
  onClickMenuItem?: UI.MenuItemClickHandler;
  definitionArray: ActionMenuDefinition<any, any>[];
}

export const useRemoteMenuItems = ({
  definitionArray,
  onShowForm,
  nestingThreshold = 1,
  onClickMenuItem,
}: RemoteMenuDecoratorProps) => {
  const socket = useSocket();
  const menusByType = useRemoteMenuFetcher(definitionArray);

  const onPostSelect = (
    menuItem: API.ContextMenuItem,
    selection: RemoteMenuData,
    values?: UI.FormValueMap,
  ) => {
    const { remoteMenuId, selectedIds, entityId } = selection;
    const { id, hook_id } = menuItem;
    return socket.post<void>(`${MenuConstants.MODULE_URL}/${remoteMenuId}/select`, {
      selected_ids: selectedIds,
      hook_id: hook_id,
      menuitem_id: id,
      entity_id: entityId,
      supports: MENU_SUPPORTS,
      form_definitions: menuItem.form_definitions,
      form_value: values,
    });
  };

  const onItemSelected = (menuItem: API.ContextMenuItem, selection: RemoteMenuData) => {
    if (onClickMenuItem) {
      onClickMenuItem();
    }

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
        allFields: UI.FormValueMap,
      ) => {
        return onPostSelect(menuItem, selection, allFields);
      };

      onShowForm({
        onSave,
        title: title,
        icon: icon[MenuConstants.ICON_TYPE_ID],
        fieldDefinitions: formFieldDefinitions,
      });
    } else {
      onPostSelect(menuItem, selection);
    }
  };

  const getRemoteItems = (): UI.ActionMenuItem[] | null => {
    if (!menusByType) {
      // Render the normal menu items for menu height estimation even when the remote items aren't available yet
      return null;
    }

    const commonOptions = {
      handleSelect: onItemSelected,
      nestingThreshold,
    };

    // Combine menus by their subscriber ID and remove duplicate items
    const combinedMenus = menusByType.reduce(
      createRemoteMenuCombineReducer(socket.logger),
      [] as CombinedContextMenu[],
    );

    // Convert the combined remote menus to action menu items
    return combinedMenus.reduce((reduced, combinedMenu) => {
      const menuItems = remoteMenuToActionMenuItems(combinedMenu, commonOptions);
      reduced.push(...menuItems);
      return reduced;
    }, [] as UI.ActionMenuItem[]);
  };

  return { getRemoteItems };
};
