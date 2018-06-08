import React from 'react';

import SectionedDropdown, { SectionedDropdownProps } from 'components/semantic/SectionedDropdown';
import MenuSection from 'components/semantic/MenuSection';
import TableDropdown, { TableDropdownProps } from 'components/semantic/TableDropdown';

import ActionMenuDecorator, { ActionMenuDecoratorProps } from 'decorators/menu/ActionMenuDecorator';
import DownloadMenuDecorator, { DownloadMenuDecoratorProps } from 'decorators/menu/DownloadMenuDecorator';
import UserMenuDecorator, { UserMenuDecoratorProps } from 'decorators/menu/UserMenuDecorator';
import { DropdownProps } from 'components/semantic/Dropdown';
import { Omit } from 'types/utils';


export interface ActionMenuProps extends SectionedDropdownProps {
  header: React.ReactNode;
}

export const ActionMenu = ActionMenuDecorator<ActionMenuProps>(({ header, children, ...other }) => (
  <SectionedDropdown { ...other }>
    <MenuSection caption={ header }>
      { children() }
    </MenuSection>
  </SectionedDropdown>
));

type TableActionMenuDropdownProps = Omit<TableDropdownProps, 'children'>;

export type TableActionMenuProps = TableActionMenuDropdownProps & ActionMenuDecoratorProps;
export const TableActionMenu = ActionMenuDecorator<TableActionMenuDropdownProps>(TableDropdown);

export type UserMenuProps = UserMenuDecoratorProps & ActionMenuProps;
export const UserMenu = UserMenuDecorator<DropdownProps>(ActionMenu);

export type TableUserMenuProps = UserMenuDecoratorProps & TableActionMenuDropdownProps;
export const TableUserMenu = UserMenuDecorator<TableActionMenuDropdownProps>(TableActionMenu);

export type DownloadMenuProps = DownloadMenuDecoratorProps & ActionMenuProps;
export const DownloadMenu = DownloadMenuDecorator<DropdownProps>(ActionMenu);

export type TableDownloadMenuProps = DownloadMenuDecoratorProps & TableActionMenuDropdownProps;
export const TableDownloadMenu = DownloadMenuDecorator<TableActionMenuDropdownProps>(TableActionMenu);
