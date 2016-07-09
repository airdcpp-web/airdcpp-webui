'use strict';
import React from 'react';

import LayoutHeader from 'components/semantic/LayoutHeader';
import SaveDecorator from '../decorators/SaveDecorator';


const SideMenu = ({ menuItems, advancedMenuItems, menuItemToLink, parent }) => {
	return (
		<div className="three wide column menu-column">
			<div className="ui vertical secondary menu">
				{ menuItems }
				{ (advancedMenuItems ? 
					<div>
						<div className="item header">
							Advanced
						</div>
						<div className="menu">
							{ advancedMenuItems }
						</div> 
					</div>
				: null) }
			</div>
		</div>
	);
};

const TopMenu = ({ parentMenuItems }) => (
	<div className="ui secondary pointing menu settings top-menu">
		{ parentMenuItems }
	</div>
);

const Content = ({ contentClassname, currentMenuItem, parent, saveButton, children }) => (
	<div className={ 'thirteen wide stretched column ' + contentClassname }>
		<div className="ui segment">
			<LayoutHeader
				className="settings-page-header"
				title={ currentMenuItem.title }
				icon={ parent.icon + ' green' }
				component={ saveButton }
			/>
			<div className="">
				{ children }
			</div>
		</div>
	</div>
);


const SideMenuLayout = ({ children, ...other }) => (
	<div className="grid-layout">
		<TopMenu {...other}/>
		<div className={ 'ui segment grid main' }>
			<SideMenu {...other}/>
			<Content {...other}>
				{ children }
			</Content>
		</div>
	</div>
);

export default SaveDecorator(SideMenuLayout);
