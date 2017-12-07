'use strict';
import PropTypes from 'prop-types';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import { RouterMenuItemLink } from 'components/semantic/MenuItem';
import LoginStore from 'stores/LoginStore';


const sectionToUrl = (section, parent) => {
  if (typeof parent === 'object') {
    return '/settings/' + parent.url + '/' + section.url;
  }

  return '/settings/' + section.url;
};

export default (Component) => {
  class SettingsMenuDecorator extends React.Component {
    static contextTypes = {
      router: PropTypes.object.isRequired
    };

    static propTypes = {
      parent: PropTypes.object,
      menuItems: PropTypes.array.isRequired,
      advancedMenuItems: PropTypes.array,
      location: PropTypes.object.isRequired,
      match: PropTypes.object.isRequired,
    };

    isItemActive = (item) => {
      const { location, parent } = this.props;
      return location.pathname.indexOf(sectionToUrl(item, parent)) === 0;
    };

    findMenuItem = (menuItems) => {
      if (!menuItems) {
        return null;
      }

      return menuItems.find(this.isItemActive);
    };

    getMenuItem = (menuItemInfo, parent, showIcon) => {
      if (menuItemInfo.debugOnly && process.env.NODE_ENV === 'production') {
        return null;
      }

      if (menuItemInfo.access && !LoginStore.hasAccess(menuItemInfo.access)) {
        return null;
      }

      let url = sectionToUrl(menuItemInfo, parent);

      // Browsing is smoother when the child page is loaded directly
      // Don't use the child URL for currently active parent so that the route is detected as active correctly
      if (menuItemInfo.menuItems && this.props.location.pathname.indexOf(url) !== 0) {
        url = sectionToUrl(menuItemInfo.menuItems[0], menuItemInfo);
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
    };

    menuItemsToRoutes = (menuItems, currentMenuItem) => {
      if (!menuItems) {
        return null;
      }

      const { parent } = this.props;
      return menuItems.map(item => (
        <Route
          key={ item.url }
          path={ sectionToUrl(item, parent) }
          render={ props => {
            const ret = React.createElement(item.component, {
              menuItems: currentMenuItem.menuItems,
              advancedMenuItems: currentMenuItem.advancedMenuItems,
              parent: currentMenuItem,
              parentMenuItems: menuItems,
              ...props,
            });

            return ret;
          } }
        />
      ));
    };

    render() {
      const { location, match, parent, menuItems, advancedMenuItems } = this.props;
      if (location.pathname === match.url ||
        (parent && location.pathname === sectionToUrl(parent))
      ) {
        return <Redirect to={ sectionToUrl(menuItems[0], parent) }/>;
      }

      const currentMenuItem = this.findMenuItem(menuItems) || this.findMenuItem(advancedMenuItems);
      if (!currentMenuItem) {
        return null;
      }

      return (
        <Component 
          { ...this.props } 
          currentMenuItem={ currentMenuItem } 
          menuItemToLink={ this.getMenuItem }
        >
          { this.menuItemsToRoutes(menuItems, currentMenuItem) }
          { this.menuItemsToRoutes(advancedMenuItems, currentMenuItem) }
        </Component>
      );
    }
  }

  return SettingsMenuDecorator;
};
