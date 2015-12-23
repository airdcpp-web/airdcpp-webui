'use strict';
import React from 'react';
import classNames from 'classnames';

import SettingPage from './SettingPage';

import Dropdown from 'components/semantic/Dropdown';


const SelectionMenu = ({ menuItems, advancedMenuItems, currentMenuItem, parentMenuItems, parent }) => {
	// Don't add nesting for items to preserve Semantic"s CSS
	const hideStyle = { display: 'none' };
	const advancedMenuStyle = !advancedMenuItems ? hideStyle : null;

	const caption = (
		<div className="caption">
			<i className={ 'green icon ' + parent.icon }/>
			{ parent.title }
		</div>
	);

	return (
		<div className="ui settings top-menu">
			<Dropdown className="selection fluid" caption={ caption }>
				{ parentMenuItems }
			</Dropdown>

			<i className="icon large caret right"/>

			<Dropdown className="selection fluid" caption={ currentMenuItem.title }>
			 	{ menuItems }
				<div className="ui divider" style={advancedMenuStyle}></div>
				<div className="header" style={advancedMenuStyle}>Advanced</div>
				{ advancedMenuItems }
			</Dropdown>
		</div>
	);
};


const GridLayout = React.createClass({
	render() {
		const { currentMenuItem, parent, children } = this.props;

		const contentClassname = classNames(
			parent.url + ' ' + currentMenuItem.url,
			'section-content',
		);

		return (
			<div className="mobile">
				<SelectionMenu { ...this.props }/>
				<div className={ contentClassname }>
					<SettingPage 
						saveable={ !currentMenuItem.noSave }
						sectionId={ currentMenuItem.url } 
						title={ currentMenuItem.title }
						icon={ parent.icon }
					>
						{ children }
					</SettingPage>
				</div>
			</div>
		);
	},
});

export default GridLayout;
