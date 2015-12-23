'use strict';
import React from 'react';

import MenuItemLink from 'components/semantic/MenuItemLink';


const sectionToUrl = (section, parent) => {
	if (typeof parent === 'object') {
		return '/settings/' + parent.url + '/' + section;
	}

	return '/settings/' + section;
};

const getMenuItem = (obj, parent) => {
	return (
		<MenuItemLink 
			key={ obj.url } 
			url={ sectionToUrl(obj.url, parent) } 
			title={ obj.title }
			icon={ obj.icon }
		/>
	);
};


export default (Component) => {
	const MenuDecorator = React.createClass({
		propTypes: {
			parent: React.PropTypes.object,
			menuItems: React.PropTypes.array.isRequired,
			advancedMenuItems: React.PropTypes.array,
		},

		checkChildren(props) {
			if (!props.children) {
				props.history.replaceState(null, sectionToUrl(props.menuItems[0].url, props.parent));
			}
		},

		componentWillMount() {
			this.checkChildren(this.props);
		},

		componentWillReceiveProps(nextProps) {
			this.checkChildren(nextProps);
		},

		isItemActive(item) {
			const { location, parent } = this.props;
			return location.pathname.indexOf(sectionToUrl(item.url, parent)) === 0;
		},

		findMenuItem(menuItems) {
			if (!menuItems) {
				return null;
			}

			return menuItems.find(this.isItemActive);
		},

		render() {
			const currentMenuItem = this.findMenuItem(this.props.menuItems) || this.findMenuItem(this.props.advancedMenuItems);
			if (!currentMenuItem) {
				return null;
			}

			return (
				<Component 
					{ ...this.props } 
					currentMenuItem={ currentMenuItem } 
					menuItemToLink={ getMenuItem }
				/>
			);
		},
	});

	return MenuDecorator;
};
