'use strict';
import React from 'react';

import SettingsMenuDecorator from '../decorators/SettingsMenuDecorator';
import BrowserUtils from 'utils/BrowserUtils';

import SettingsSideMenuLayout from './SettingsSideMenuLayout';
import SettingsTopMenuLayout from './SettingsTopMenuLayout';


const MainSection = SettingsMenuDecorator((props) => {
	const Component = BrowserUtils.useMobileLayout() || window.innerWidth < 950 ? SettingsTopMenuLayout : SettingsSideMenuLayout;

	const { parent, menuItemToLink } = props;

	return (
		<Component 
			{ ...props }
			parentMenuItems={ props.parentMenuItems.map(item => menuItemToLink(item)) }
			menuItems={ props.menuItems.map(item => menuItemToLink(item, parent)) }
			advancedMenuItems={ props.advancedMenuItems ? props.advancedMenuItems.map(item => menuItemToLink(item, parent)) : null }
		/>
	);
});

export default MainSection;
