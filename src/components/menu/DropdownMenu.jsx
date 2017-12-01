import React from 'react';

import Dropdown from 'components/semantic/Dropdown';
import DropdownSection from 'components/semantic/DropdownSection';
import TableDropdown from 'components/semantic/TableDropdown';

import ActionMenuDecorator from 'decorators/menu/ActionMenuDecorator';
import DownloadMenuDecorator from 'decorators/menu/DownloadMenuDecorator';
import UserMenuDecorator from 'decorators/menu/UserMenuDecorator';


export const TableActionMenu = ActionMenuDecorator(TableDropdown);
export const ActionMenu = ActionMenuDecorator(({ header, children, ...other }) => (
  <Dropdown { ...other }>
    <DropdownSection caption={ header }>
      { children() }
    </DropdownSection>
  </Dropdown>
));

export const UserMenu = UserMenuDecorator(ActionMenu);
export const TableUserMenu = UserMenuDecorator(TableActionMenu);

export const DownloadMenu = DownloadMenuDecorator(ActionMenu);
export const TableDownloadMenu = DownloadMenuDecorator(TableActionMenu);
