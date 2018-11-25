'use strict';
import React from 'react';
import classNames from 'classnames';

import SettingsMenuDecorator, { SettingsMenuDecoratorChildProps } from '../decorators/SettingsMenuDecorator';
import { useMobileLayout } from 'utils/BrowserUtils';

import SettingsSideMenuLayout from './SettingsSideMenuLayout';
import SettingsTopMenuLayout from './SettingsTopMenuLayout';

import SaveDecorator, { SaveDecoratorChildProps, SaveDecoratorProps } from '../decorators/SaveDecorator';


export interface SettingSectionProps {

}

type Props = SaveDecoratorChildProps & SettingsMenuDecoratorChildProps;
// tslint:disable-next-line:max-line-length
export interface SettingSectionChildProps extends SaveDecoratorChildProps, Pick<Props, 'parent' | 'currentMenuItem'> {
  contentClassname: string;
  parentMenuItems: React.ReactNode[];
  menuItems: React.ReactNode[];
  advancedMenuItems?: React.ReactNode[];
}



const SettingSection: React.FC<Props> = (props) => {
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
      advancedMenuItems={ advancedMenuItems ? advancedMenuItems.map(item => menuItemToLink(item, parent)) : undefined }
    />
  );
};

const SettingSectionDecorated = SettingsMenuDecorator<SaveDecoratorProps>(
  SaveDecorator<SettingsMenuDecoratorChildProps>(SettingSection)
);

export default SettingSectionDecorated;
