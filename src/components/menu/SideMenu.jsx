'use strict';

import React from 'react';
import Reflux from 'reflux';

import History from 'utils/History';
import { Link } from 'react-router';

import TransferStats from 'components/TransferStats';

import HubSessionStore from 'stores/HubSessionStore';
import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';
import 'stores/FilelistSessionStore'; // must be required here for now
import LogStore from 'stores/LogStore';

import CountLabel from 'components/CountLabel';
import LabelInfo from 'utils/LabelInfo';

import PerformanceTools from './PerformanceTools';
import TouchIcon from './TouchIcon';

const MenuItem = React.createClass({
	contextTypes: {
		history: React.PropTypes.object.isRequired
	},

	onClick: function (evt) {
		evt.preventDefault();

		if (this.context.history.isActive(this.props.url)) {
			History.replaceSidebarData(this.props.location, { close: true });
			return;
		}

		History.pushSidebar(this.props.location, this.props.url);
	},

	render: function () {
		return (
			<Link to={this.props.url} className="item" onClick={this.onClick} activeClassName="active">
				<CountLabel className="mini" unreadInfo={this.props.unreadInfo}/>
				<i className={ this.props.icon + ' icon' }></i>
				{this.props.title}
			</Link>
		);
	}
});

const SideMenu = React.createClass({
	mixins: [ Reflux.connect(PrivateChatSessionStore, 'chatSessions'), Reflux.connect(HubSessionStore, 'hubSessions'), Reflux.connect(LogStore, 'logMessages') ],
	contextTypes: {
		history: React.PropTypes.object.isRequired
	},

	render() {
		return (
			<div id="side-menu">
				<div className="content">
					<div className="ui labeled icon vertical inverted menu">
						<MenuItem title="Hubs" url="/hubs" unreadInfo={ LabelInfo.getHubUnreadInfo(HubSessionStore.getUnreadCounts()) } location={this.props.location} icon="blue sitemap"/>
						<MenuItem title="Messages" url="/messages" unreadInfo={ LabelInfo.getPrivateChatUnreadInfo(PrivateChatSessionStore.getUnreadCounts()) } location={this.props.location} icon="blue comments"/>
						<MenuItem title="Filelists" url="/filelists" labelCount={ 0 } location={this.props.location} icon="blue browser"/>
						<MenuItem title="Events" url="/events" unreadInfo={ LabelInfo.getLogUnreadInfo(LogStore.getUnreadCounts()) } location={this.props.location} icon="blue history"/>
					</div>
				</div>
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
