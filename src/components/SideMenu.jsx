'use strict';

import React from 'react';
import Reflux from 'reflux';

import History from 'utils/History'
import LoginActions from 'actions/LoginActions'
import { Link } from 'react-router';
import TransferStats from 'components/TransferStats'

import HubSessionStore from 'stores/HubSessionStore'
import HubActions from 'actions/HubActions'

import PrivateChatSessionStore from 'stores/PrivateChatSessionStore'
import PrivateChatActions from 'actions/PrivateChatActions'
import PrivateChatMessageStore from 'stores/PrivateChatMessageStore'

import NotificationActions from 'actions/NotificationActions'

import LogActions from 'actions/LogActions'
import LogStore from 'stores/LogStore'

import FilelistSessionStore from 'stores/FilelistSessionStore'
import FilelistActions from 'actions/FilelistActions'

import CountLabel from 'components/CountLabel'
import LabelInfo from 'utils/LabelInfo'

const MenuItem = React.createClass({
	onClick: function(evt) {
		evt.preventDefault();

		History.pushSidebar(this.props.location, this.props.page);
	},

	render: function() {
		return (
			<Link to={this.props.page} className="item" onClick={this.onClick}>
				<CountLabel className="mini" unreadInfo={this.props.unreadInfo}/>
				<i className={ this.props.icon + " icon" }></i>
				{this.props.title}
			</Link>
		);
	}
});

const SideMenu = React.createClass({
	mixins: [Reflux.connect(PrivateChatSessionStore, "chatSessions"), Reflux.connect(HubSessionStore, "hubSessions"), Reflux.connect(LogStore, "logMessages")],
	displayName: "Side menu",

	componentDidMount() {
		this.listenTo(PrivateChatMessageStore, this.onPrivateMessage);
	},
	
	onPrivateMessage(messages) {
		if (messages.length == 0) {
			return;
		}

		const last = messages[messages.length - 1];
		if (last.chat_message && !last.chat_message.is_read) {
			const cid = last.chat_message.reply_to.cid;
			NotificationActions.info({
				title: last.chat_message.from.nick,
				message: last.chat_message.text,
				uid: cid,
				action: {
					label: "View message",
					callback: () => { History.pushSidebar(this.props.location, 'messages/session/' + cid); }
				}
			});
		}
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
						<MenuItem unreadInfo={ LabelInfo.getHubUnreadInfo(HubSessionStore.getUnreadCounts()) } location={this.props.location} icon="blue sitemap" title="Hubs" page="hubs"/>
						<MenuItem unreadInfo={ LabelInfo.getPrivateChatUnreadInfo(PrivateChatSessionStore.getUnreadCounts()) } location={this.props.location} icon="blue comments" title="Messages" page="messages"/>
						<MenuItem labelCount={ 0 } location={this.props.location} icon="blue browser" title="Filelists" page="filelists"/>
						<MenuItem unreadInfo={ LabelInfo.getLogUnreadInfo(LogStore.getUnreadCounts()) } location={this.props.location} icon="blue history" title="Events" page="events"/>
					</div>
				</div>
				<div>
					<TransferStats className="ui centered inverted mini list"/>
				</div>
			</div>
		);
	}
});

export default SideMenu