'use strict';

import React from 'react';

import MenuItemLink from 'components/semantic/MenuItemLink';

import '../style.css';

const Settings = React.createClass({
	componentWillMount() {
		if (!this.props.children) {
			this.props.history.replaceState(null, '/settings/personal');
		}
	},

	render() {
		return (
			<div className="ui segment settings-layout">
				<div className="ui secondary pointing menu settings top-menu">
					<MenuItemLink url="/settings/personal" title="Personal"/>
					<MenuItemLink url="/settings/connectivity" title="Connectivity"/>
					<MenuItemLink url="/settings/downloads" title="Downloads"/>
					<MenuItemLink url="/settings/sharing" title="Sharing"/>
				</div>
				<div className="section-content">
					{ this.props.children }
				</div>
			</div>
		);
	},
});

export default Settings;
