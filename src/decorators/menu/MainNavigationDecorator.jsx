import React from 'react';
import Reflux from 'reflux';

import HubSessionStore from 'stores/HubSessionStore';
import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';
import 'stores/FilelistSessionStore'; // must be required here for now
import 'stores/ViewFileStore'; // must be required here for now
import EventStore from 'stores/EventStore';

import LoginActions from 'actions/LoginActions';
import LoginStore from 'stores/LoginStore';
import AccessConstants from 'constants/AccessConstants';
import IconConstants from 'constants/IconConstants';


const MainMenuItems = [
	{
		title: 'Home',
		url: '/',
		icon: IconConstants.HOME,
	}, {
		title: 'Queue',
		url: '/queue',
		icon: IconConstants.QUEUE,
		access: AccessConstants.QUEUE_VIEW,
	}, {
		title: 'Search',
		url: '/search',
		icon: IconConstants.SEARCH,
		access: AccessConstants.SEARCH,
	}, {
		title: 'Transfers',
		url: '/transfers',
		icon: IconConstants.TRANSFERS,
		access: AccessConstants.TRANSFERS,
	}
];

const ConfigMenuItems = [
	{
		title: 'Favorites',
		url: '/favorite-hubs',
		icon: IconConstants.FAVORITE,
		access: AccessConstants.FAVORITE_HUBS_VIEW,
	}, {
		title: 'Settings',
		url: '/settings',
		icon: IconConstants.SETTINGS,
		access: AccessConstants.SETTINGS_VIEW,
	}
];

const SecondaryMenuItems = [
	{
		title: 'Hubs',
		url: '/hubs',
		icon: 'blue sitemap',
		unreadInfoStore: HubSessionStore,
		access: AccessConstants.HUBS_VIEW,
	}, {
		title: 'Messages',
		url: '/messages',
		icon: 'blue comments',
		unreadInfoStore: PrivateChatSessionStore,
		access: AccessConstants.PRIVATE_CHAT_VIEW,
	}, {
		title: 'Filelists',
		url: '/filelists',
		icon: 'blue browser',
		access: AccessConstants.FILELISTS_VIEW,
	}, {
		title: 'Files',
		url: '/files',
		icon: 'blue file',
		access: AccessConstants.VIEW_FILE_VIEW,
	}, {
		title: 'Events',
		url: '/events',
		icon: 'blue history',
		unreadInfoStore: EventStore,
		access: AccessConstants.EVENTS_VIEW,
	}
];

const onClickLogout = (item, e) => {
	e.preventDefault();
	LoginActions.logout();
};

const LogoutItem = { 
	icon: 'sign out', 
	url: 'logout', 
	title: 'Logout',
	className: 'logout', 
	onClick: onClickLogout,
};

const filterItem = item => !item.access || LoginStore.hasAccess(item.access);

export default function (Component) {
	const MainNavigationDecorator = React.createClass({
		mixins: [ Reflux.connect(PrivateChatSessionStore, 'chatSessions'), Reflux.connect(HubSessionStore, 'hubSessions'), Reflux.connect(EventStore, 'logMessages') ],
		render() {
			return (
				<Component 
					{...this.props} 
					secondaryMenuItems={ SecondaryMenuItems.filter(filterItem) } 
					mainMenuItems={ MainMenuItems.filter(filterItem) }
					configMenuItems={ ConfigMenuItems.filter(filterItem) }
					logoutItem={ LogoutItem }
				/>
			);
		}
	});

	return MainNavigationDecorator;
}
