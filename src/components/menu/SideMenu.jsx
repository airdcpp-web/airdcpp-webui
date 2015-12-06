'use strict';

import React from 'react';

import History from 'utils/History';

import TransferStats from 'components/TransferStats';
import PerformanceTools from './PerformanceTools';
import TouchIcon from './TouchIcon';

import { getIconMenuItem } from './MenuItem';


const SideMenu = React.createClass({
	contextTypes: {
		history: React.PropTypes.object.isRequired
	},

	propTypes: {
		sidebarItems: React.PropTypes.array.isRequired,
	},

	onClick(url, evt) {
		evt.preventDefault();

		if (this.context.history.isActive(url)) {
			History.replaceSidebarData(this.props.location, { close: true });
			return;
		}

		History.pushSidebar(this.props.location, url);
	},

	render() {
		return (
			<div id="side-menu">
				<div className="content">
					<div className="ui labeled icon vertical small inverted menu">
						{ this.props.sidebarItems.map(getIconMenuItem.bind(this, this.onClick)) }
					</div>
				</div>
				<div className="ui divider"/>
				<div>
					<TransferStats className="ui centered inverted mini list"/>
				</div>
				<div className="touch-icon">
					<TouchIcon/>
					{ process.env.NODE_ENV !== 'production' ? <PerformanceTools/> : null }
				</div>
			</div>
		);
	}
});

export default SideMenu;
