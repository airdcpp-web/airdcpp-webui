import * as React from 'react';
import classNames from 'classnames';

import SettingsMenuDecorator, {
  SettingsMenuDecoratorChildProps,
} from '../decorators/SettingsMenuDecorator';
import { useMobileLayout } from 'utils/BrowserUtils';

import SettingsSideMenuLayout from './SettingsSideMenuLayout';
import SettingsTopMenuLayout from './SettingsTopMenuLayout';

import SaveDecorator, {
  SaveDecoratorChildProps,
  SaveDecoratorProps,
} from '../decorators/SaveDecorator';

import * as UI from 'types/ui';
import { menuItemToLinkComponent } from './MenuItems';
import { useLocation } from 'react-router-dom';

export interface SettingSectionProps {}

type Props = SaveDecoratorChildProps & SettingsMenuDecoratorChildProps;

export type SettingSectionChildProps = SaveDecoratorChildProps &
  Pick<Props, 'parent' | 'currentMenuItem'> &
  Pick<UI.RouteComponentProps, 'location'> &
  React.PropsWithChildren<{
    contentClassname: string;
    parentMenuItems: React.ReactNode[];
    menuItems: React.ReactNode[];
    advancedMenuItems?: React.ReactNode[];
    settingsT: UI.ModuleTranslator;
    moduleT: UI.ModuleTranslator;
  }>;

const SettingSection: React.FC<Props> = (props) => {
  const location = useLocation();

  const Component =
    useMobileLayout() || window.innerWidth < 1000
      ? SettingsTopMenuLayout
      : SettingsSideMenuLayout;

  const {
    moduleT,
    settingsT,
    parentMenuItems,
    menuItems,
    advancedMenuItems,
    ...childProps
  } = props;
  const { parent, currentMenuItem } = props;

  const contentClassname = classNames(
    'section-content',
    `${parent!.url} ${currentMenuItem.url}`
  );

  return (
    <Component
      {...childProps}
      settingsT={settingsT}
      moduleT={moduleT!}
      location={location}
      contentClassname={contentClassname}
      parentMenuItems={props.parentMenuItems!.map((item) =>
        menuItemToLinkComponent(item, undefined, settingsT, location)
      )}
      menuItems={
        !props.menuItems
          ? []
          : props.menuItems.map((item) =>
              menuItemToLinkComponent(item, parent, settingsT, location)
            )
      }
      advancedMenuItems={
        !advancedMenuItems
          ? undefined
          : advancedMenuItems.map((item) =>
              menuItemToLinkComponent(item, parent, settingsT, location)
            )
      }
    />
  );
};

const SettingSectionDecorated = SettingsMenuDecorator<SaveDecoratorProps>(
  SaveDecorator<SettingsMenuDecoratorChildProps>(SettingSection)
);

export default SettingSectionDecorated;
