import React from 'react';

import SectionedDropdown, { SectionedDropdownProps } from 'components/semantic/SectionedDropdown';
import MenuSection from 'components/semantic/MenuSection';
import TableDropdown, { TableDropdownProps } from 'components/semantic/TableDropdown';

import ActionMenuDecorator from 'decorators/menu/ActionMenuDecorator';
import DownloadMenuDecorator from 'decorators/menu/DownloadMenuDecorator';
import UserMenuDecorator from 'decorators/menu/UserMenuDecorator';
//import { DropdownProps } from 'components/semantic/Dropdown';


export interface ActionMenuProps {
  header: React.ReactNode;
}

export const ActionMenu = ActionMenuDecorator<SectionedDropdownProps & ActionMenuProps>(({ header, children, ...other }) => (
  <SectionedDropdown { ...other }>
    <MenuSection caption={ header }>
      { children() }
    </MenuSection>
  </SectionedDropdown>
));


export const TableActionMenu = ActionMenuDecorator<TableDropdownProps>(TableDropdown);


export const UserMenu = UserMenuDecorator(ActionMenu);
export const TableUserMenu = UserMenuDecorator(TableActionMenu);

export const DownloadMenu = DownloadMenuDecorator(ActionMenu);
export const TableDownloadMenu = DownloadMenuDecorator(TableActionMenu);
