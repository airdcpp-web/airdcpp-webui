'use strict';
import React from 'react';

import MenuItemLink from 'components/semantic/MenuItemLink';
import SettingPage from './SettingPage';

const GridLayout = React.createClass({
	propTypes: {
		id: React.PropTypes.any.isRequired,
		menuItems: React.PropTypes.array.isRequired,
		advancedMenuItems: React.PropTypes.array,
		saveable: React.PropTypes.bool,
	},

	sectionToUrl(section) {
		return '/settings/' + this.props.id + '/' + section;
	},

	getDefaultProps() {
		return {
			saveable: true
		};
	},

	getMenuItem(obj) {
		return (
			<MenuItemLink 
				key={ obj.url } 
				url={ this.sectionToUrl(obj.url) } 
				title={ obj.title }
			/>
		);
	},

	checkChildren(props) {
		if (!props.children) {
			props.history.replace(this.sectionToUrl(props.menuItems[0].url));
		}
	},

	componentWillMount() {
		this.checkChildren(this.props);
	},

	componentWillReceiveProps(nextProps) {
		this.checkChildren(nextProps);
	},

	isItemActive(item) {
		return this.props.location.pathname === this.sectionToUrl(item.url);
	},

	findMenuItem(menuItems) {
		if (!menuItems) {
			return null;
		}

		return menuItems.find(this.isItemActive);
	},

	render() {
		let { children, menuItems, advancedMenuItems } = this.props;

		const currentMenuItem = this.findMenuItem(this.props.menuItems) || this.findMenuItem(this.props.advancedMenuItems);
		if (!currentMenuItem) {
			return null;
		}

		return (
			<div className={ 'ui segment grid settings-grid-layout ' + this.props.id }>
				<div className="three wide column menu-column">
					<div className="ui vertical secondary menu">
						{ menuItems.map(this.getMenuItem) }
						{ (advancedMenuItems ? 
							<div>
								<div className="item header">
									Advanced
								</div>
								<div className="menu">
									{ advancedMenuItems.map(this.getMenuItem) }
								</div> 
							</div>
						: null) }
					</div>
				</div>
				<div className={ 'thirteen wide stretched column content-column ' + this.props.id + ' ' + currentMenuItem.url }>
					<SettingPage 
						saveable={ this.props.saveable && !currentMenuItem.noSave }
						sectionId={ currentMenuItem.url } 
						title={ currentMenuItem.title }
						icon={ this.props.icon }
					>
						{ children }
					</SettingPage>
				</div>
			</div>
		);
	},
});

export default GridLayout;
