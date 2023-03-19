import PropTypes from 'prop-types';
import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import * as UI from 'types/ui';
import {
  menuItemsToRouteComponentArray,
  findMenuItem,
  sectionToUrl,
} from '../components/MenuItems';

export interface SectionType {
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

export interface RootSectionType extends SectionType {}

export interface ChildSectionType extends SectionType {}

export interface SettingsMenuDecoratorProps extends RouteComponentProps<UI.EmptyObject> {
  parent?: RootSectionType;
  menuItems?: ChildSectionType[] | RootSectionType[];
  advancedMenuItems?: ChildSectionType[];
  parentMenuItems?: RootSectionType[];
  settingsT: UI.ModuleTranslator;
  moduleT?: UI.ModuleTranslator;
}

export type SettingsMenuDecoratorChildProps = SettingsMenuDecoratorProps &
  React.PropsWithChildren<{
    currentMenuItem: SectionType;
    parent?: RootSectionType;
  }>;

export default function <PropsT>(
  Component: React.ComponentType<SettingsMenuDecoratorChildProps & PropsT>
) {
  class SettingsMenuDecorator extends React.Component<
    SettingsMenuDecoratorProps & PropsT
  > {
    static propTypes = {
      parent: PropTypes.object,
      menuItems: PropTypes.array.isRequired,
      advancedMenuItems: PropTypes.array,
      location: PropTypes.object.isRequired,
      match: PropTypes.object.isRequired,
    };

    render() {
      const {
        location,
        match,
        parent,
        menuItems,
        advancedMenuItems,
        settingsT,
        moduleT,
      } = this.props;
      if (
        location.pathname === match.url ||
        (parent && location.pathname === sectionToUrl(parent as SectionType))
      ) {
        if (!!menuItems && menuItems.length) {
          return <Redirect to={sectionToUrl(menuItems[0], parent)} />;
        }
      }

      const currentMenuItem =
        findMenuItem(menuItems, parent, location) ||
        findMenuItem(advancedMenuItems, parent, location);

      if (!currentMenuItem) {
        return null;
      }

      return (
        <Component {...this.props} currentMenuItem={currentMenuItem}>
          {menuItemsToRouteComponentArray(
            currentMenuItem,
            menuItems,
            settingsT,
            moduleT,
            parent
          )}
          {menuItemsToRouteComponentArray(
            currentMenuItem,
            advancedMenuItems,
            settingsT,
            moduleT,
            parent
          )}
        </Component>
      );
    }
  }

  return SettingsMenuDecorator;
}
