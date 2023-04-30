import * as React from 'react';
import { Navigate, useLocation, useMatch } from 'react-router-dom';

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

export interface SettingsMenuDecoratorProps {
  parent?: RootSectionType;
  menuItems?: ChildSectionType[] | RootSectionType[];
  advancedMenuItems?: ChildSectionType[];
  parentMenuItems?: RootSectionType[];
  settingsT: UI.ModuleTranslator;
  moduleT?: UI.ModuleTranslator;
}

export type SettingsMenuDecoratorChildProps = SettingsMenuDecoratorProps & {
  currentMenuItem: SectionType;
  parent?: RootSectionType;
  children: React.ReactNode[];
};

export default function <PropsT>(
  Component: React.ComponentType<SettingsMenuDecoratorChildProps & PropsT>
) {
  const SettingsMenuDecorator: React.FC<SettingsMenuDecoratorProps & PropsT> = (
    props
  ) => {
    const location = useLocation();
    const match = useMatch();
    const { parent, menuItems, advancedMenuItems, settingsT, moduleT } = props;
    if (
      location.pathname === match.url ||
      (parent && location.pathname === sectionToUrl(parent as SectionType))
    ) {
      if (!!menuItems && menuItems.length) {
        return <Navigate to={sectionToUrl(menuItems[0], parent)} />;
      }
    }

    const currentMenuItem =
      findMenuItem(menuItems, parent, location) ||
      findMenuItem(advancedMenuItems, parent, location);

    if (!currentMenuItem) {
      return null;
    }

    return (
      <Component {...props} currentMenuItem={currentMenuItem}>
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
  };

  return SettingsMenuDecorator;
}
