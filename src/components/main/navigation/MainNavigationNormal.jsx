'use strict';

import React from 'react';
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
		const { configMenuItems, mainMenuItems, logoutItem, menuItemGetter } = this.props;
		return (
			<div className="item right">
				{ mainMenuItems.map(item => menuItemGetter(null, false, item)) }

				<Dropdown className="top right">
					{ configMenuItems.map(item => menuItemGetter(null, true, item)) }
					<div className="divider"/>
					{ menuItemGetter(logoutItem.onClick, true, logoutItem) }
				</Dropdown>
			</div>
		);
	},
});

export default MainNavigationDecorator(MainNavigationNormal);
