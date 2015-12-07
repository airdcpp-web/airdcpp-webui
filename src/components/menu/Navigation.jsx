'use strict';

import React from 'react';
import LoginActions from 'actions/LoginActions';
import { getTextMenuItem } from './MenuItem';

import MainNavigationDecorator from 'decorators/MainNavigationDecorator';

const LogoutItem = { 
	url: 'logout', 
	title: 'Logout',
	className: 'logout', 
};

const Navigation = React.createClass({
	contextTypes: {
		history: React.PropTypes.object.isRequired
	},

	onClickLogout(item, e) {
		e.preventDefault();
		LoginActions.logout();
	},
	
	render() {
		return (
			<div className="item right">
				{ this.props.mainMenuItems.map(item => getTextMenuItem(null, item)) }
				{ getTextMenuItem(this.onClickLogout, LogoutItem) }
			</div>
		);
	},
});

export default MainNavigationDecorator(Navigation);
