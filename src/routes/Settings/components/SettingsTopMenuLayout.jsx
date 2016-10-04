'use strict';
import React from 'react';

import Dropdown from 'components/semantic/Dropdown';
import SaveDecorator from '../decorators/SaveDecorator';


const MenuSection = ({ menuItems, advancedMenuItems, currentMenuItem, parentMenuItems, parent }) => {
	// Don't add nesting for items to preserve Semantic's CSS
	const hideStyle = { display: 'none' };
	const advancedMenuStyle = !advancedMenuItems ? hideStyle : null;

	const caption = (
		<div className="caption">
			<i className={ 'green icon ' + parent.icon }/>
			{ parent.title }
		</div>
	);

	return (
		<div className="ui top-menu">
			<Dropdown className="selection fluid" caption={ caption }>
				{ parentMenuItems }
			</Dropdown>

			<i className="icon large caret right"/>

			<Dropdown className="selection fluid" caption={ currentMenuItem.title }>
			 	{ menuItems }
				<div className="ui divider" style={advancedMenuStyle}/>
				<div className="header" style={advancedMenuStyle}>Advanced</div>
				{ advancedMenuItems }
			</Dropdown>
		</div>
	);
};


const TopMenuLayout = ({ saveButton, children, contentClassname, message, ...other }) => (
	<div className="mobile">
		<MenuSection { ...other }/>
		<div id="setting-scroll-context" className={ contentClassname }>
			{ saveButton }
			{ message }
			{ children }
		</div>
	</div>
);

export default SaveDecorator(TopMenuLayout, 'fluid');
