'use strict';

import React from 'react';
import { getTextMenuItem, getIconMenuItem } from 'components/menu/MenuItem';
import Dropdown from 'components/semantic/Dropdown';

import MainNavigationDecorator from 'decorators/menu/MainNavigationDecorator';

const { PropTypes } = React;


const MainNavigationNormal = React.createClass({
	propTypes: {
		mainMenuItems: PropTypes.array.isRequired,
		configMenuItems: PropTypes.array.isRequired,
		logoutItem: PropTypes.object.isRequired,
	},
	
	render() {
		const { configMenuItems, mainMenuItems, logoutItem } = this.props;
		return (
			<div className="item right">
				{ mainMenuItems.map(item => getTextMenuItem(null, item)) }

				<Dropdown className="top right">
					{ configMenuItems.map(item => getIconMenuItem(null, item)) }
					<div className="divider"></div>
					{ getIconMenuItem(logoutItem.onClick, logoutItem) }
				</Dropdown>
			</div>
		);
	},
});

export default MainNavigationDecorator(MainNavigationNormal);
