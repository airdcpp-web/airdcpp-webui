import * as React from 'react';
import classNames from 'classnames';

import { usingMobileLayout } from 'utils/BrowserUtils';

import SettingsSideMenuLayout from './SettingsSideMenuLayout';
import SettingsTopMenuLayout from './SettingsTopMenuLayout';

import * as UI from 'types/ui';

import { childMenuItemToLinkComponent, rootMenuItemToLinkComponent } from './MenuItems';
import { useLocation } from 'react-router';
import { ChildSectionType, RootSectionType } from '../types';
import {
  SettingSaveContext,
  useSettingSaveContext,
} from '../effects/useSettingSaveContext';
import Message from 'components/semantic/Message';
import IconConstants from 'constants/IconConstants';
import SaveButton from './SaveButton';
import { useSession } from 'context/SessionContext';

export interface SettingRootSectionProps {
  settingsT: UI.ModuleTranslator;
  rootMenuItems: RootSectionType[];
  selectedRootMenuItem: RootSectionType;
  selectedChildMenuItem: ChildSectionType;
  children: React.ReactNode;
}

export type SettingSectionProps = SettingRootSectionProps;

const getMessage = (childMenuItem: ChildSectionType, settingsT: UI.ModuleTranslator) => {
  return (
    childMenuItem.local && (
      <Message
        description={settingsT.t(
          'browserSpecificNote',
          'Settings listed on this page are browser-specific',
        )}
        icon={IconConstants.INFO}
      />
    )
  );
};

const SettingSection: React.FC<SettingSectionProps> = (props) => {
  const login = useSession();
  const {
    rootMenuItems,
    selectedRootMenuItem,
    settingsT,
    children,
    selectedChildMenuItem,
  } = props;

  const location = useLocation();
  const { saveState, saveContext } = useSettingSaveContext({
    selectedChildMenuItem,
    settingsT,
  });

  const SectionLayoutComponent =
    usingMobileLayout() || window.innerWidth < 1000
      ? SettingsTopMenuLayout
      : SettingsSideMenuLayout;

  const { menuItems, advancedMenuItems } = selectedRootMenuItem;

  const contentClassname = classNames(
    'section-content',
    selectedRootMenuItem.url,
    selectedChildMenuItem.url,
  );

  const menu = {
    rootMenuItems: rootMenuItems.map((item) =>
      rootMenuItemToLinkComponent(item, settingsT, location, login),
    ),
    childMenuItems: menuItems.map((item) =>
      childMenuItemToLinkComponent(item, selectedRootMenuItem, settingsT, login),
    ),
    childAdvancedMenuItems: advancedMenuItems?.map((item) =>
      childMenuItemToLinkComponent(item, selectedRootMenuItem, settingsT, login),
    ),
  };

  const getSaveButton = (className: string) => {
    if (selectedChildMenuItem.noSave) {
      return null;
    }

    return (
      <SaveButton settingsT={settingsT} saveState={saveState} className={className} />
    );
  };

  return (
    <SettingSaveContext.Provider value={saveContext}>
      <SectionLayoutComponent
        settingsT={settingsT}
        location={location}
        getSaveButton={getSaveButton}
        message={getMessage(selectedChildMenuItem, settingsT)}
        contentClassname={contentClassname}
        menu={menu}
        selectedChildMenuItem={selectedChildMenuItem}
        selectedRootMenuItem={selectedRootMenuItem}
      >
        {children}
      </SectionLayoutComponent>
    </SettingSaveContext.Provider>
  );
};

export default SettingSection;
