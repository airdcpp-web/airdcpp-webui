import Dropdown from 'components/semantic/Dropdown';
import TableDropdown from 'components/semantic/TableDropdown';

import ActionMenuDecorator from 'decorators/ActionMenuDecorator';
import DownloadMenuDecorator from 'decorators/DownloadMenuDecorator';
import UserMenuDecorator from 'decorators/UserMenuDecorator';


export const TableActionMenu = ActionMenuDecorator(TableDropdown);
export const ActionMenu = ActionMenuDecorator(Dropdown);

export const UserMenu = UserMenuDecorator(ActionMenu);
export const TableUserMenu = UserMenuDecorator(TableActionMenu);

export const DownloadMenu = DownloadMenuDecorator(ActionMenu);
export const TableDownloadMenu = DownloadMenuDecorator(TableActionMenu);
