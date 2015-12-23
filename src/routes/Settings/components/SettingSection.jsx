'use strict';
import React from 'react';
import classNames from 'classnames';


import SettingsMenuDecorator from '../decorators/SettingsMenuDecorator';
import BrowserUtils from 'utils/BrowserUtils';

import SettingsSideMenuLayout from './SettingsSideMenuLayout';
import SettingsTopMenuLayout from './SettingsTopMenuLayout';


const MainSection = SettingsMenuDecorator((props) => {
	const Component = BrowserUtils.useMobileLayout() || window.innerWidth < 950 ? SettingsTopMenuLayout : SettingsSideMenuLayout;

	const { parent, menuItemToLink, currentMenuItem } = props;

	const contentClassname = classNames(
		'section-content',
		{ 'full-width': currentMenuItem.fullWidth },
		parent.url + ' ' + currentMenuItem.url,
	);

	return (
		<Component 
			{ ...props }
			contentClassname={ contentClassname }
			parentMenuItems={ props.parentMenuItems.map(item => menuItemToLink(item)) }
			menuItems={ props.menuItems.map(item => menuItemToLink(item, parent)) }
			advancedMenuItems={ props.advancedMenuItems ? props.advancedMenuItems.map(item => menuItemToLink(item, parent)) : null }
		/>
	);
});

export default MainSection;
