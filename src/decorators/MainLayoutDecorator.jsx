import React from 'react';
import Reflux from 'reflux';

import HubSessionStore from 'stores/HubSessionStore';
import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';
import 'stores/FilelistSessionStore'; // must be required here for now
import LogStore from 'stores/LogStore';

import LabelInfo from 'utils/LabelInfo';
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

		getSidebarItems() {
			return [
				{
					title: 'Hubs',
					url: '/hubs',
					unreadInfo: LabelInfo.getHubUnreadInfo(HubSessionStore.getUnreadCounts()),
					location: this.props.location,
					icon: 'blue sitemap',
				}, {
					title: 'Messages',
					url: '/messages',
					unreadInfo: LabelInfo.getPrivateChatUnreadInfo(PrivateChatSessionStore.getUnreadCounts()),
					location: this.props.location,
					icon: 'blue comments',
				}, {
					title: 'Filelists',
					url: '/filelists',
					labelCount: 0,
					location: this.props.location,
					icon: 'blue browser',
				}, {
					title: 'Events',
					url: '/events',
					unreadInfo: LabelInfo.getLogUnreadInfo(LogStore.getUnreadCounts()),
					location: this.props.location,
					icon: 'blue history',
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
