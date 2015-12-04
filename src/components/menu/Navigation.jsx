'use strict';

import React from 'react';
import LoginActions from 'actions/LoginActions';
import { getTextMenuItem } from './MenuItem';

const LogoutItem = { 
	url: 'logout', 
	title: 'Logout',
	className: 'logout', 
};

export default class Navigation extends React.Component {
	constructor() {
		super();
	}

	static contextTypes = {
		history: React.PropTypes.object.isRequired
	}
	
	render() {
		return (
			<div className="item right">
				{ this.props.mainMenuItems.map(item => getTextMenuItem(null, item)) }
				{ getTextMenuItem(this.onClickLogout, LogoutItem) }
			</div>
		);
	}

	onClickLogout(item, e) {
		e.preventDefault();
		LoginActions.logout();
	}
}
