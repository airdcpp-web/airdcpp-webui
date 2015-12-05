import React from 'react';
import Reflux from 'reflux';

import HubSessionStore from 'stores/HubSessionStore';
import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';
import 'stores/FilelistSessionStore'; // must be required here for now
import LogStore from 'stores/LogStore';

import UrgencyUtils from 'utils/UrgencyUtils';
import { HubMessageUrgencies, PrivateMessageUrgencies, LogMessageUrgencies } from 'constants/UrgencyConstants';
import { SIDEBAR_ID } from 'constants/OverlayConstants';

const MainNavigationItems = [
	{
		title: 'Home',
		url: '/',
		icon: 'home',
	}, {
		title: 'Favorites',
		url: '/favorite-hubs',
		icon: 'yellow star',
	}, {
		title: 'Queue',
		url: '/queue',
		icon: 'green download',
	}, {
		title: 'Search',
		url: '/search',
		icon: 'search',
	}, {
		title: 'Settings',
		url: '/settings',
		icon: 'configure',
	}
];

export default function (Component, sidebarContext) {
	const showSideBar = (props) => {
		return props.location.state &&
			props.location.state[SIDEBAR_ID];
	};

	const MainNavigationDecorator = React.createClass({
		mixins: [ Reflux.connect(PrivateChatSessionStore, 'chatSessions'), Reflux.connect(HubSessionStore, 'hubSessions'), Reflux.connect(LogStore, 'logMessages') ],

		componentWillReceiveProps(nextProps) {
			if (showSideBar(nextProps)) {
				if (!this.previousChildren) {
					// save the old children (just like animation)
					this.previousChildren = this.props.children;
				}
			} else {
				this.previousChildren = null;
			}
		},

		onClickSidebar() {

		},

		getSidebarItems() {
			return [
				{
					title: 'Hubs',
					url: '/hubs',
					icon: 'blue sitemap',
					unreadInfoStore: HubSessionStore,
				}, {
					title: 'Messages',
					url: '/messages',
					icon: 'blue comments',
					unreadInfoStore: PrivateChatSessionStore,
				}, {
					title: 'Filelists',
					url: '/filelists',
					icon: 'blue browser',
				}, {
					title: 'Events',
					url: '/events',
					icon: 'blue history',
					unreadInfoStore: LogStore,
				}
			];
		},

		render() {
			let sidebar = null;
			if (showSideBar(this.props)) {
				sidebar = React.cloneElement(this.props.children, { 
					overlayId: SIDEBAR_ID,
					overlayContext: sidebarContext,
				});
			}

			return (
				<Component 
					{...this.props} 
					secondaryMenuItems={ this.getSidebarItems() } 
					mainMenuItems={ MainNavigationItems } 
					sidebar={sidebar}
					mainContent={this.previousChildren ? this.previousChildren : this.props.children}
				/>
			);
		},
	});

	return MainNavigationDecorator;
}
