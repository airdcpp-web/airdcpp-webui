import React from 'react';

import Dropdown from './semantic/Dropdown';
import TableDropdown from './semantic/TableDropdown';

import DownloadActions from 'actions/DownloadActions';

import ActionMenuDecorator from 'decorators/ActionMenuDecorator';
import UserMenuDecorator from 'decorators/UserMenuDecorator';


export const TableActionMenu = ActionMenuDecorator(TableDropdown);
export const ActionMenu = ActionMenuDecorator(Dropdown);

export const UserMenu = UserMenuDecorator(ActionMenu);
export const TableUserMenu = UserMenuDecorator(TableActionMenu);


export const TableDownloadMenu = ({ handler, parentEntity, itemInfo, location, caption, ...other }) => {
	const data = {
		parentEntity: parentEntity,
		handler: handler,
		itemInfo: itemInfo,
		location: location
	};

	return (
		<TableActionMenu 
			caption={ caption } 
			actions={ DownloadActions } 
			ids={[ 'download', 'downloadTo' ]} 
			itemData={ data } 
			{ ...other }
		/>
	);
};

TableDownloadMenu.propTypes = {

	/**
	 * Possible entity to be passed to the handler (when not used for items in a singleton entity)
	 */
	parentEntity: React.PropTypes.any,

	/**
	 * Function for handling the download
	 */
	handler: React.PropTypes.func.isRequired,

	/**
	 * Additional data to be passed to the handler
	 */
	itemInfo: React.PropTypes.any,

	/**
	 * Location from component props
	 */
	location: React.PropTypes.object.isRequired
};
