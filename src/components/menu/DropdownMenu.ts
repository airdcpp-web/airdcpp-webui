import TableDropdown, { TableDropdownProps } from 'components/semantic/TableDropdown';

import ActionMenuDecorator, {
  ActionMenuDecoratorProps,
} from 'decorators/menu/ActionMenuDecorator';
import DownloadMenuDecorator, {
  DownloadMenuDecoratorProps,
} from 'decorators/menu/DownloadMenuDecorator';
import UserMenuDecorator, {
  UserMenuDecoratorProps,
} from 'decorators/menu/UserMenuDecorator';

import { DropdownProps } from 'components/semantic/Dropdown';

import * as UI from 'types/ui';
import { ActionMenuProps, ActionMenu } from './ActionDropdownMenu';

type TableActionMenuDropdownProps = Omit<TableDropdownProps, 'children' | 'caption'>;

export type TableActionMenuProps<ItemDataT extends UI.ActionMenuItemDataValueType> =
  TableActionMenuDropdownProps & ActionMenuDecoratorProps<ItemDataT>;
export const TableActionMenu = ActionMenuDecorator<TableActionMenuDropdownProps, any>(
  TableDropdown
);

export type UserMenuProps = UserMenuDecoratorProps & ActionMenuProps;
export const UserMenu = UserMenuDecorator<DropdownProps>(ActionMenu);

export type TableUserMenuProps = UserMenuDecoratorProps & TableActionMenuDropdownProps;
export const TableUserMenu =
  UserMenuDecorator<TableActionMenuDropdownProps>(TableActionMenu);

export type DownloadMenuProps<ItemDataT extends UI.DownloadableItemInfo> =
  DownloadMenuDecoratorProps<ItemDataT> & ActionMenuProps;

export const DownloadMenu = DownloadMenuDecorator<DropdownProps, any>(ActionMenu);

export type TableDownloadMenuProps<ItemDataT extends UI.DownloadableItemInfo> =
  DownloadMenuDecoratorProps<ItemDataT> & TableActionMenuDropdownProps;

export const TableDownloadMenu = DownloadMenuDecorator<TableActionMenuDropdownProps, any>(
  TableActionMenu
);
