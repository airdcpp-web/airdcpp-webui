import React from 'react';

import SectionedDropdown from 'components/semantic/SectionedDropdown';
import MenuSection from 'components/semantic/MenuSection';
import TableDropdown from 'components/semantic/TableDropdown';

import ActionMenuDecorator from 'decorators/menu/ActionMenuDecorator';
import DownloadMenuDecorator from 'decorators/menu/DownloadMenuDecorator';
import UserMenuDecorator from 'decorators/menu/UserMenuDecorator';


export const TableActionMenu = ActionMenuDecorator(TableDropdown);
export const ActionMenu = ActionMenuDecorator(({ header, children, ...other }) => (
  <SectionedDropdown { ...other }>
    <MenuSection caption={ header }>
      { children() }
    </MenuSection>
  </SectionedDropdown>
));

export const UserMenu = UserMenuDecorator(ActionMenu);
export const TableUserMenu = UserMenuDecorator(TableActionMenu);

export const DownloadMenu = DownloadMenuDecorator(ActionMenu);
export const TableDownloadMenu = DownloadMenuDecorator(TableActionMenu);
