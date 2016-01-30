'use strict';

import React from 'react';
import { getTextMenuItem } from './MenuItem';
import Dropdown from 'components/semantic/Dropdown';

import MainNavigationDecorator from 'decorators/menu/MainNavigationDecorator';


const dropdownItems = [ '/settings', '/favorite-hubs' ];

const isDropdown = (item) => dropdownItems.indexOf(item.url) !== -1;
const noDropdown = (item) => !isDropdown(item);

const Navigation = React.createClass({
	contextTypes: {
		history: React.PropTypes.object.isRequired
	},

	getItems(filter) {
		return this.props.mainMenuItems
					.filter(filter)
					.map(item => getTextMenuItem(null, item));
	},
	
	render() {
		const { logoutItem } = this.props;
		return (
			<div className="item right">
				{ this.getItems(noDropdown) }

				<Dropdown className="top right" caption={ '' }>
					{ this.getItems(isDropdown) }
					{ getTextMenuItem(logoutItem.onClick, logoutItem) }
				</Dropdown>
			</div>
		);
	},
});

export default MainNavigationDecorator(Navigation);
