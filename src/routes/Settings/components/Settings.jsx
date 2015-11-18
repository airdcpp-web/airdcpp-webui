'use strict';

import React from 'react';

import MenuItemLink from 'components/semantic/MenuItemLink';

import '../style.css';

const Settings = React.createClass({
	checkChildren(props) {
		if (!props.children) {
			props.history.replaceState(null, '/settings/personal');
		}
	},

	componentWillMount() {
		this.checkChildren(this.props);
	},

	componentWillReceiveProps(nextProps) {
		this.checkChildren(nextProps);
	},

	render() {
		return (
			<div className="ui segment settings-layout">
				<div className="ui secondary pointing menu settings top-menu">
					<MenuItemLink url="/settings/personal" title="Personal"/>
					<MenuItemLink url="/settings/connectivity" title="Connectivity"/>
					<MenuItemLink url="/settings/speed-limits" title="Speed and limits"/>
					<MenuItemLink url="/settings/downloads" title="Downloads"/>
					<MenuItemLink url="/settings/sharing" title="Sharing"/>
					<MenuItemLink url="/settings/about" title="About"/>
				</div>
				<div className="section-content">
					{ this.props.children }
				</div>
			</div>
		);
	},
});

export default Settings;