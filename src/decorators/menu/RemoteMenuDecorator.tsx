import React, { useEffect, useState } from 'react';

import * as API from 'types/api';
import * as UI from 'types/ui';

import MenuConstants from 'constants/MenuConstants';
import MenuItemLink from 'components/semantic/MenuItemLink';
import SocketService from 'services/SocketService';
import { IdType } from 'types/api';
import NotificationActions from 'actions/NotificationActions';
import { FormSaveHandler } from 'components/form';
import { MenuFormDialogProps } from 'components/menu/MenuFormDialog';


type OnClickHandler = () => void;

const SUPPORTS = [ 'urls', 'form' ];


interface SelectionData {
  menuItem: API.ContextMenuItem;
  selectedIds: UI.ActionIdType[];
  remoteMenuId: string;
}

type SelectHandler = (selection: SelectionData) => void;

const toMenuItem = (
  selection: SelectionData,
  onClick: OnClickHandler | undefined,
  handleSelect: SelectHandler,
) => {
  const { menuItem } = selection;
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
          handleSelect(selection);
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
  onShowForm: (data: MenuFormDialogProps) => void;
}

type Props = RemoteMenuDecoratorProps;

const RemoteMenuDecorator: React.FC<Props> = ({
  remoteMenuIds, selectedIds: selectedIdsByMenu, children, onClickMenuItem, entityId, onShowForm
}) => {
  const [ menus, setMenus ] = useState<(Array<API.ContextMenuItem>)[] | undefined>(undefined);

  useEffect(
    () => {
      const fetchMenus = async () => {
        const menuPromises = remoteMenuIds
          .map((remoteMenuId, menuIndex) => !remoteMenuId ? [] : 
            SocketService.post<API.ContextMenuItem[]>(`${MenuConstants.MODULE_URL}/${remoteMenuId}/list`, {
              selected_ids: selectedIdsByMenu[menuIndex],
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

  const onPostSelect = (selection: SelectionData, values?: UI.FormValueMap) => {
    const { menuItem, remoteMenuId, selectedIds } = selection;
    const { id, hook_id } = menuItem;
    return SocketService.post<void>(`${MenuConstants.MODULE_URL}/${remoteMenuId}/select`, {
      selected_ids: selectedIds,
      hook_id: hook_id,
      menuitem_id: id,
      entity_id: entityId,
      supports: SUPPORTS,
      form_definitions: menuItem.form_definitions,
      form_value: values,
    });
  };
  
  const onItemSelected = (selection: SelectionData) => {
    const formFieldDefinitions = selection.menuItem.form_definitions;
    if (!!formFieldDefinitions && !!formFieldDefinitions.length) {
      const { title, icon } = selection.menuItem;

      const onSave: FormSaveHandler<UI.FormValueMap> = (changedFields: UI.FormValueMap, allFields: UI.FormValueMap) => {
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
  const ret = !menus ? null : menus
    .map((menu, menuIndex) => {
      const remoteMenuId = remoteMenuIds[menuIndex];
      if (!remoteMenuId) {
        return [];
      }

      return menu
        .map(menuItem => 
          toMenuItem(
            { 
              menuItem, 
              remoteMenuId, 
              selectedIds: selectedIdsByMenu[menuIndex], 
            },
            onClickMenuItem, 
            onItemSelected
          )
        );
    });

  return (
    <>
      { children(ret) }
    </>
  );
};

export default RemoteMenuDecorator;
