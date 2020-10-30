'use strict';
import * as React from 'react';
import classNames from 'classnames';

import SettingsMenuDecorator, { SettingsMenuDecoratorChildProps } from '../decorators/SettingsMenuDecorator';
import { useMobileLayout } from 'utils/BrowserUtils';

import SettingsSideMenuLayout from './SettingsSideMenuLayout';
import SettingsTopMenuLayout from './SettingsTopMenuLayout';

import SaveDecorator, { SaveDecoratorChildProps, SaveDecoratorProps } from '../decorators/SaveDecorator';
import { RouteComponentProps } from 'react-router';

import * as UI from 'types/ui';
import { menuItemToLinkComponent } from './MenuItems';


export interface SettingSectionProps {

}

type Props = SaveDecoratorChildProps & SettingsMenuDecoratorChildProps;
// tslint:disable-next-line:max-line-length
export interface SettingSectionChildProps extends SaveDecoratorChildProps, Pick<Props, 'parent' | 'currentMenuItem'>, RouteComponentProps {
  contentClassname: string;
  parentMenuItems: React.ReactNode[];
  menuItems: React.ReactNode[];
  advancedMenuItems?: React.ReactNode[];
  settingsT: UI.ModuleTranslator;
  moduleT: UI.ModuleTranslator;
}



const SettingSection: React.FC<Props> = (props) => {
  const Component = useMobileLayout() || window.innerWidth < 1000 ? SettingsTopMenuLayout : SettingsSideMenuLayout;

  const { moduleT, settingsT, parentMenuItems, menuItems, advancedMenuItems, location, ...childProps } = props;
  const { parent, currentMenuItem } = props;

  const contentClassname = classNames(
    'section-content',
    `${parent!.url} ${currentMenuItem.url}`,
  );

  return (
    <Component 
      { ...childProps }
      settingsT={ settingsT }
      moduleT={ moduleT! }
      location={ location }
      contentClassname={ contentClassname }
      parentMenuItems={ 
        props.parentMenuItems!.map(item => menuItemToLinkComponent(item, undefined, settingsT, location)) 
      }
      menuItems={ !props.menuItems ? [] : 
        props.menuItems.map(item => menuItemToLinkComponent(item, parent, settingsT, location)) 
      }
      advancedMenuItems={ !advancedMenuItems ? undefined : 
        advancedMenuItems.map(item => menuItemToLinkComponent(item, parent, settingsT, location)) 
      }
    />
  );
};

const SettingSectionDecorated = SettingsMenuDecorator<SaveDecoratorProps>(
  SaveDecorator<SettingsMenuDecoratorChildProps>(SettingSection)
);

export default SettingSectionDecorated;
