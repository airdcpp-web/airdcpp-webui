'use strict';

import React from 'react';

import History from 'utils/History';

import MainNavigationDecorator from 'decorators/menu/MainNavigationDecorator';
import { getIconMenuItem } from 'components/menu/MenuItem';
import IconPanel from './IconPanel';


const SideMenu = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	onClick(url, evt) {
		evt.preventDefault();

		if (this.context.router.isActive(url)) {
			History.replaceSidebarData(this.props.location, { close: true });
			return;
		}

		History.pushSidebar(this.props.location, url);
	},

	render() {
		const { secondaryMenuItems } = this.props;
		return (
			<div id="side-menu">
				{ secondaryMenuItems.length > 0 ? (
					<div className="content">
						<div className="ui labeled icon vertical small inverted menu">
							{ secondaryMenuItems.map(getIconMenuItem.bind(this, this.onClick)) }
						</div>
					</div>
				) : null }
				<div className="ui divider"/>
				<IconPanel/>
			</div>
		);
	}
});

export default MainNavigationDecorator(SideMenu);
