'use strict';
import PropTypes from 'prop-types';
import React from 'react';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';

import RouterMenuItemLink from 'components/semantic/RouterMenuItemLink';
import LoginStore from 'stores/LoginStore';


interface SectionType {
  url: string;
  access?: string;
  title: string;
  component: React.ComponentType<SettingsMenuDecoratorProps>;
  debugOnly?: boolean;
  icon?: string;
  menuItems?: ChildSectionType[] | RootSectionType[];
  advancedMenuItems?: ChildSectionType[];
  parentMenuItems?: RootSectionType[];
  noSave?: boolean;
  local?: boolean;
}

export interface RootSectionType extends SectionType {

}

export interface ChildSectionType extends SectionType {

}

const sectionToUrl = (section: SectionType, parent?: SectionType) => {
  if (typeof parent === 'object') {
    return `/settings/${parent.url}/${section.url}`;
  }

  return `/settings/${section.url}`;
};

export interface SettingsMenuDecoratorProps extends RouteComponentProps<{}> {
  parent: RootSectionType;
  menuItems?: ChildSectionType[] | RootSectionType[];
  advancedMenuItems?: ChildSectionType[];
  parentMenuItems: RootSectionType[];
}

export interface SettingsMenuDecoratorChildProps extends SettingsMenuDecoratorProps {
  currentMenuItem: SectionType;
  menuItemToLink: (menuItemInfo: SectionType, parent?: RootSectionType) => React.ReactNode;
}

export default function <PropsT>(Component: React.ComponentType<SettingsMenuDecoratorChildProps & PropsT>) {
  class SettingsMenuDecorator extends React.Component<SettingsMenuDecoratorProps & PropsT> {
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

    isItemActive = (item: SectionType) => {
      const { location, parent } = this.props;
      return location.pathname.indexOf(sectionToUrl(item, parent)) === 0;
    }

    findMenuItem = (menuItems?: SectionType[]) => {
      if (!menuItems) {
        return null;
      }

      return menuItems.find(this.isItemActive);
    }

    menuItemToLinkComponent = (menuItemInfo: SectionType, parent: RootSectionType) => {
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
          icon={ !!menuItemInfo.icon && 'green ' + menuItemInfo.icon }
        >
          { menuItemInfo.title }
        </RouterMenuItemLink>
      );
    }

    menuItemsToRouteComponentArray = (currentMenuItem: SectionType, menuItems?: SectionType[]) => {
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
              ...props,
              menuItems: currentMenuItem.menuItems,
              advancedMenuItems: currentMenuItem.advancedMenuItems,
              parent: currentMenuItem,
              parentMenuItems: menuItems,
            });

            return ret;
          } }
        />
      ));
    }

    render() {
      const { location, match, parent, menuItems, advancedMenuItems } = this.props;
      if (location.pathname === match.url ||
        (parent && location.pathname === sectionToUrl(parent))
      ) {
        if (!!menuItems && menuItems.length) {
          return <Redirect to={ sectionToUrl(menuItems[0], parent) }/>;
        }
      }

      const currentMenuItem = this.findMenuItem(menuItems) || this.findMenuItem(advancedMenuItems);
      if (!currentMenuItem) {
        return null;
      }

      return (
        <Component 
          { ...this.props } 
          currentMenuItem={ currentMenuItem } 
          menuItemToLink={ this.menuItemToLinkComponent }
        >
          { this.menuItemsToRouteComponentArray(currentMenuItem, menuItems) }
          { this.menuItemsToRouteComponentArray(currentMenuItem, advancedMenuItems) }
        </Component>
      );
    }
  }

  return SettingsMenuDecorator;
}
