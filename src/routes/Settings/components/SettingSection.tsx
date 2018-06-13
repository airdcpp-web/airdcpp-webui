'use strict';
import React from 'react';
import classNames from 'classnames';

import SettingsMenuDecorator, { SettingsMenuDecoratorChildProps } from '../decorators/SettingsMenuDecorator';
import { useMobileLayout } from 'utils/BrowserUtils';

import SettingsSideMenuLayout from './SettingsSideMenuLayout';
import SettingsTopMenuLayout from './SettingsTopMenuLayout';

import SaveDecorator, { SaveDecoratorChildProps } from '../decorators/SaveDecorator';


export interface SettingSectionProps extends SaveDecoratorChildProps, SettingsMenuDecoratorChildProps {

}

export interface SettingSectionChildProps extends SaveDecoratorChildProps, Pick<SettingSectionProps, 'parent' | 'currentMenuItem'> {
  contentClassname: string;
  parentMenuItems: React.ReactNode[];
  menuItems: React.ReactNode[];
  advancedMenuItems?: React.ReactNode[];
}

const SettingSection: React.SFC<SettingSectionProps> = (props) => {
  const Component = useMobileLayout() || window.innerWidth < 950 ? SettingsTopMenuLayout : SettingsSideMenuLayout;

  const { menuItemToLink, parentMenuItems, menuItems, advancedMenuItems, ...childProps } = props;
  const { parent, currentMenuItem } = props;

  const contentClassname = classNames(
    'section-content',
    `${parent.url} ${currentMenuItem.url}`,
  );

  return (
    <Component 
      { ...childProps }
      contentClassname={ contentClassname }
      parentMenuItems={ props.parentMenuItems.map(item => menuItemToLink(item)) }
      menuItems={ !!props.menuItems ? props.menuItems.map(item => menuItemToLink(item, parent)) : [] }
      advancedMenuItems={ props.advancedMenuItems ? props.advancedMenuItems.map(item => menuItemToLink(item, parent)) : undefined }
    />
  );
};

export default SettingsMenuDecorator(
  SaveDecorator<SettingsMenuDecoratorChildProps>(SettingSection)
);
