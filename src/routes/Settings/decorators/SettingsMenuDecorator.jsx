'use strict';
import PropTypes from 'prop-types';
import React from 'react';

import { RouterMenuItemLink } from 'components/semantic/MenuItem';
import LoginStore from 'stores/LoginStore';


const sectionToUrl = (section, parent) => {
	if (typeof parent === 'object') {
		return '/settings/' + parent.url + '/' + section;
	}

	return '/settings/' + section;
};

export default (Component) => {
	const MenuDecorator = React.createClass({
		contextTypes: {
			router: PropTypes.object.isRequired
		},

		propTypes: {
			parent: PropTypes.object,
			menuItems: PropTypes.array, // required
			advancedMenuItems: PropTypes.array,
			location: PropTypes.object, // required
		},

		checkChildren(props) {
			if (!props.children) {
				this.context.router.replace({
					pathname: sectionToUrl(props.menuItems[0].url, props.parent)
				});
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

		getMenuItem(menuItemInfo, parent, showIcon) {
			if (menuItemInfo.debugOnly && process.env.NODE_ENV === 'production') {
				return null;
			}

			if (menuItemInfo.access && !LoginStore.hasAccess(menuItemInfo.access)) {
				return null;
			}

			let url = sectionToUrl(menuItemInfo.url, parent);

			// Browsing is smoother when the child page is loaded directly
			// Don't use the child URL for currently active parent so that the route is detected as active correctly
			if (menuItemInfo.menuItems && this.props.location.pathname.indexOf(url) !== 0) {
				url = sectionToUrl(menuItemInfo.menuItems[0].url, menuItemInfo);
			}

			return (
				<RouterMenuItemLink 
					key={ url } 
					url={ url } 
					icon={ menuItemInfo.icon ? ('green ' + menuItemInfo.icon) : null }
				>
					{ menuItemInfo.title }
				</RouterMenuItemLink>
			);
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
					menuItemToLink={ this.getMenuItem }
				/>
			);
		},
	});

	return MenuDecorator;
};
