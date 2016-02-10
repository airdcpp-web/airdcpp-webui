'use strict';

import React from 'react';
import { getTextMenuItem, getIconMenuItem } from './MenuItem';
import Dropdown from 'components/semantic/Dropdown';

import MainNavigationDecorator from 'decorators/menu/MainNavigationDecorator';


const dropdownItems = [ '/settings', '/favorite-hubs' ];

const isDropdown = (item) => dropdownItems.indexOf(item.url) !== -1;
const noDropdown = (item) => !isDropdown(item);

const Navigation = React.createClass({
	contextTypes: {
		history: React.PropTypes.object.isRequired
	},

	getItems(filter, formatter) {
		return this.props.mainMenuItems
					.filter(filter)
					.map(item => formatter(null, item));
	},
	
	render() {
		const { logoutItem } = this.props;
		return (
			<div className="item right">
				{ this.getItems(noDropdown, getTextMenuItem) }

				<Dropdown className="top right">
					{ this.getItems(isDropdown, getIconMenuItem) }
					<div className="divider"></div>
					{ getIconMenuItem(logoutItem.onClick, logoutItem) }
				</Dropdown>
			</div>
		);
	},
});

export default MainNavigationDecorator(Navigation);
