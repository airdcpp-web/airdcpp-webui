'use strict';

import React from 'react';
import Reflux from 'reflux';

import History from 'utils/History';
import { Link } from 'react-router';
import TransferStats from 'components/TransferStats';

import HubSessionStore from 'stores/HubSessionStore';
import HubActions from 'actions/HubActions';

import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';
import PrivateChatActions from 'actions/PrivateChatActions';

import LogActions from 'actions/LogActions';
import LogStore from 'stores/LogStore';

import FilelistSessionStore from 'stores/FilelistSessionStore'; // must be required here for now
import FilelistActions from 'actions/FilelistActions';

import CountLabel from 'components/CountLabel';
import LabelInfo from 'utils/LabelInfo';

import BrowserUtils from 'utils/BrowserUtils';
import LocalSettingStore from 'stores/LocalSettingStore';

const MenuItem = React.createClass({
	contextTypes: {
		history: React.PropTypes.object.isRequired
	},

	onClick: function (evt) {
		evt.preventDefault();

		History.pushSidebar(this.props.location, this.props.page);
	},

	render: function () {
		return (
			<Link to={this.props.page} className="item" onClick={this.onClick} activeClassName="active">
				<CountLabel className="mini" unreadInfo={this.props.unreadInfo}/>
				<i className={ this.props.icon + ' icon' }></i>
				{this.props.title}
			</Link>
		);
	}
});

const TouchIcon = React.createClass({
	onClick: function (evt) {
		LocalSettingStore.toggleTouchMode();
		this.forceUpdate();
	},

	render: function () {
		if (!BrowserUtils.hasTouchSupport()) {
			return null;
		}

		const touchIconColor = LocalSettingStore.touchModeEnabled ? 'blue' : 'grey';
		return <i className={ touchIconColor + ' link large pointing up icon' } onClick={ this.onClick }></i>;
	}
});

const SideMenu = React.createClass({
	mixins: [ Reflux.connect(PrivateChatSessionStore, 'chatSessions'), Reflux.connect(HubSessionStore, 'hubSessions'), Reflux.connect(LogStore, 'logMessages') ],
	contextTypes: {
		history: React.PropTypes.object.isRequired
	},

	getEventButtonCaption() {

	},

	componentWillMount() {
		PrivateChatActions.fetchSessions();
		HubActions.fetchSessions();
		FilelistActions.fetchSessions();

		LogActions.fetchMessages();
	},

	render() {
		return (
			<div id="side-menu">
				<div className="content">
					<div className="ui labeled icon vertical inverted menu">
						<MenuItem title="Hubs" page="/sidebar/hubs" unreadInfo={ LabelInfo.getHubUnreadInfo(HubSessionStore.getUnreadCounts()) } location={this.props.location} icon="blue sitemap"/>
						<MenuItem title="Messages" page="/sidebar/messages" unreadInfo={ LabelInfo.getPrivateChatUnreadInfo(PrivateChatSessionStore.getUnreadCounts()) } location={this.props.location} icon="blue comments"/>
						<MenuItem title="Filelists" page="/sidebar/filelists" labelCount={ 0 } location={this.props.location} icon="blue browser"/>
						<MenuItem title="Events" page="/sidebar/events" unreadInfo={ LabelInfo.getLogUnreadInfo(LogStore.getUnreadCounts()) } location={this.props.location} icon="blue history"/>
					</div>
				</div>
				<div>
					<TransferStats className="ui centered inverted mini list"/>
				</div>
				<div className="touch-icon">
					<TouchIcon/>
				</div>
			</div>
		);
	}
});

export default SideMenu;
