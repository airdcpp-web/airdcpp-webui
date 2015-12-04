'use strict';

import React from 'react';
import LoginActions from 'actions/LoginActions';
import { getTextMenuItem } from './MenuItem';

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
				<a className="item" href="" onClick={this.logout}>
					Logout
				</a>
			</div>
		);
	}

	logout(e) {
		e.preventDefault();
		LoginActions.logout();
	}
}
