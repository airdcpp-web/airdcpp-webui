'use strict';

import React from 'react';

import AccessConstants from 'constants/AccessConstants';
import LoginStore from 'stores/LoginStore';

import SettingsMenuDecorator from '../decorators/SettingsMenuDecorator';


import '../style.css';

const menu = [
	{
		url: 'profile',
		title: 'Profile',
		icon: 'user',
		menuItems: [
			{ 
				title: 'User', 
				url: 'user' 
			}, { 
				title: 'Away mode', 
				url: 'away' 
			}, 
		],
		advancedMenuItems: [
			{ 
				title: 'Miscellaneous', 
				url: 'miscellaneous' 
			},
		],
	}, {
		url: 'connectivity',
		title: 'Connectivity',
		icon: 'signal',
		menuItems: [
			{ 
				title: 'Auto detection', 
				url: 'detection', 
				noSave: true 
			},
		],
		advancedMenuItems: [
			{ 
				title: 'IPv4 connectivity (manual)', 
				url: 'v4' 
			}, {
				title: 'IPv6 connectivity (manual)', 
				url: 'v6' 
			}, { 
				title: 'Ports (manual)', 
				url: 'ports' 
			}, { 
				title: 'Encryption', 
				url: 'encryption' 
			},
		],
	}, {
		url: 'speed-limits',
		title: 'Speed and limits',
		icon: 'dashboard',
		menuItems: [
			{ 
				title: 'Connection speed', 
				url: 'speed' 
			}, { 
				title: 'Bandwidth limiting', 
				url: 'limiter',
			},
		],
		advancedMenuItems: [
			{ 
				title: 'Download limits', 
				url: 'download-limits' 
			}, { 
				title: 'Upload limits', 
				url: 'upload-limits' 
			}, { 
				title: 'Per-user limits', 
				url: 'user-limits' 
			},
		],
	}, {
		url: 'downloads',
		title: 'Downloads',
		icon: 'download',
		menuItems: [
			{ 
				title: 'Locations', 
				url: 'locations' 
			},
		],
		advancedMenuItems: [
			{ 
				title: 'Skipping options', 
				url: 'skipping-options' 
			}, { 
				title: 'Search matching', 
				url: 'search-matching' 
			}, { 
				title: 'Download options', 
				url: 'download-options' 
			}
		],
	}, {
		url: 'sharing',
		title: 'Sharing',
		icon: 'tasks',
		menuItems: [
			{ 
				title: 'Directories', 
				url: 'directories', 
				noSave: true, 
				fullWidth: true 
			}, { 
				title: 'Share profiles', 
				url: 'profiles', 
				noSave: true 
			}, { 
				title: 'Refresh options', 
				url: 'refresh-options' 
			},
		],
		advancedMenuItems: [
			{ 
				title: 'Sharing options', 
				url: 'sharing-options' 
			}, { 
				title: 'Hashing', 
				url: 'hashing' 
			},
		],
	}, {
		url: 'view',
		title: 'View',
		icon: 'browser',
		menuItems: [
			{ 
				title: 'Histories', 
				url: 'histories' 
			}, { 
				title: 'Events', 
				url: 'events' 
			},
		],
	}, {
		url: 'about',
		title: 'About',
		icon: 'info',
		menuItems: [
			{ 
				title: 'Application', 
				url: 'application' 
			}, { 
				title: 'Transfer statistics', 
				url: 'transfers' 
			}, { 
				title: 'Share statistics', 
				url: 'share' 
			}, { 
				title: 'Hub statistics', 
				url: 'hubs' 
			},
		],
	},
];

const MainLayout = SettingsMenuDecorator(({ menuItems, children, currentMenuItem }) => {
	const child = React.cloneElement(children, {
		menuItems: currentMenuItem.menuItems,
		advancedMenuItems: currentMenuItem.advancedMenuItems,
		parent: currentMenuItem,
		parentMenuItems: menuItems,
	});

	return (
		<div className="ui segment settings-layout">
			{ child }
		</div>
	);
});

// Only to pass menu items to the decorated component
const Settings = React.createClass({
	render() {
		let menuItems = menu;
		if (LoginStore.hasAccess(AccessConstants.ADMIN)) {
			menuItems = [ ...menu, {
				url: 'system',
				title: 'System',
				icon: 'settings',
				menuItems: [
					{ 
						title: 'Users', 
						url: 'users', 
						noSave: true, 
						fullWidth: true 
					}, { 
						title: 'Logging', 
						url: 'logging',
					},
				],
			} ];
		}

		return (
			<MainLayout { ...this.props } menuItems={ menuItems }/>
		);
	},
});

export default Settings;