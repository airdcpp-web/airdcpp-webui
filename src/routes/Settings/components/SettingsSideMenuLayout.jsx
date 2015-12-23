'use strict';
import React from 'react';
import classNames from 'classnames';

import SettingPage from './SettingPage';


const SubMenu = ({ menuItems, advancedMenuItems, menuItemToLink, parent }) => {
	return (
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
	);
};


const GridLayout = React.createClass({
	render() {
		const { parentMenuItems, currentMenuItem, parent, children,
			id 
		} = this.props;

		const contentClassname = classNames(
			'thirteen wide stretched column content-column',
			{ 'full-width': currentMenuItem.fullWidth },
			id + ' ' + currentMenuItem.url,
		);

		return (
			<div className="grid-layout">
				<div className="ui secondary pointing menu settings top-menu">
					{ parentMenuItems }
				</div>
				<div className={ 'ui segment grid settings-grid-layout ' + id }>
					<div className="three wide column menu-column">
						<SubMenu {...this.props}/>
					</div>
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
			</div>
		);
	},
});

export default GridLayout;
