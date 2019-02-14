import React from 'react';

import RouterMenuItemLink from 'components/semantic/RouterMenuItemLink';
import { Location } from 'history';
import LoginStore from 'stores/LoginStore';
import { Route } from 'react-router-dom';
import { SectionType, RootSectionType } from '../decorators/SettingsMenuDecorator';

import * as UI from 'types/ui';


export const sectionToUrl = (section: SectionType, parent?: SectionType) => {
  if (typeof parent === 'object') {
    return `/settings/${parent.url}/${section.url}`;
  }

  return `/settings/${section.url}`;
};

export const menuItemToLinkComponent = (
  menuItemInfo: SectionType, 
  parent: RootSectionType | undefined, 
  settingsT: UI.ModuleTranslator,
  location: Location
) => {
  if (menuItemInfo.debugOnly && process.env.NODE_ENV === 'production') {
    return null;
  }

  if (menuItemInfo.access && !LoginStore.hasAccess(menuItemInfo.access)) {
    return null;
  }

  let url = sectionToUrl(menuItemInfo, parent);

  // Browsing is smoother when the child page is loaded directly
  // Don't use the child URL for currently active parent so that the route is detected as active correctly
  if (menuItemInfo.menuItems && location.pathname.indexOf(url) !== 0) {
    url = sectionToUrl(menuItemInfo.menuItems[0], menuItemInfo);
  }

  return (
    <RouterMenuItemLink 
      key={ url } 
      url={ url } 
      icon={ !!menuItemInfo.icon ? `green ${menuItemInfo.icon}` : null }
    >
      { settingsT.translate(menuItemInfo.title, [ UI.SubNamespaces.NAVIGATION ]) }
    </RouterMenuItemLink>
  );
};

export const menuItemsToRouteComponentArray = (
  currentMenuItem: SectionType, 
  menuItems: SectionType[] | undefined,
  settingsT: UI.ModuleTranslator,
  parent: SectionType | undefined
) => {
  if (!menuItems) {
    return null;
  }

  return menuItems.map(item => (
    <Route
      key={ item.url }
      path={ sectionToUrl(item, parent) }
      render={ props => (
        <item.component
          { ...props }
          menuItems={ currentMenuItem.menuItems }
          advancedMenuItems={ currentMenuItem.advancedMenuItems }
          parent={ currentMenuItem }
          parentMenuItems={ menuItems }
          settingsT={ settingsT }
        />
      ) }
    />
  ));
};


export const isItemActive = (
  item: SectionType, 
  parent: RootSectionType | undefined, 
  location: Location
) => {
  return location.pathname.indexOf(sectionToUrl(item, parent)) === 0;
};

export const findMenuItem = (
  menuItems: SectionType[] | undefined, 
  parent: RootSectionType | undefined, 
  location: Location
) => {
  if (!menuItems) {
    return null;
  }

  return menuItems.find(item => isItemActive(item, parent, location));
};
