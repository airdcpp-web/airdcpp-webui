import TableDropdown, { TableDropdownProps } from '@/components/semantic/TableDropdown';

import ActionMenuDecorator, {
  ActionMenuDecoratorProps,
} from './decorators/ActionMenuDecorator';
import DownloadMenuDecorator, {
  DownloadMenuDecoratorProps,
} from './decorators/DownloadMenuDecorator';
import UserMenuDecorator, {
  UserMenuDecoratorProps,
} from './decorators/UserMenuDecorator';

import { DropdownProps } from '@/components/semantic/Dropdown';

import * as UI from '@/types/ui';
import { ActionMenuProps, ActionMenu } from './ActionDropdownMenu';
import { buildMenu } from './builder/slidingMenuBuilder';

type TableActionMenuDropdownProps = Omit<TableDropdownProps, 'children' | 'caption'>;

export type TableActionMenuProps<
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
> = TableActionMenuDropdownProps & ActionMenuDecoratorProps<ItemDataT, EntityT>;
export const TableActionMenu = ActionMenuDecorator<
  TableActionMenuDropdownProps,
  any,
  any
>(TableDropdown, buildMenu);

export type UserMenuProps = UserMenuDecoratorProps & ActionMenuProps;
export const UserMenu = UserMenuDecorator<DropdownProps>(ActionMenu);

export type TableUserMenuProps = UserMenuDecoratorProps & TableActionMenuDropdownProps;
export const TableUserMenu =
  UserMenuDecorator<TableActionMenuDropdownProps>(TableActionMenu);

export type DownloadMenuProps<
  ItemDataT extends UI.DownloadableItemInfo,
  EntityT extends UI.SessionItemBase,
> = DownloadMenuDecoratorProps<ItemDataT, EntityT> & ActionMenuProps;

export const DownloadMenu = DownloadMenuDecorator<DropdownProps, any, any>(ActionMenu);

export type TableDownloadMenuProps<
  ItemDataT extends UI.DownloadableItemInfo,
  EntityT extends UI.SessionItemBase,
> = DownloadMenuDecoratorProps<ItemDataT, EntityT> & TableActionMenuDropdownProps;

export const TableDownloadMenu = DownloadMenuDecorator<
  TableActionMenuDropdownProps,
  any,
  any
>(TableActionMenu);
