import * as UI from 'types/ui';

import '../style.css';

import Profile from '../routes/Profile';
import Connectivity from '../routes/Connectivity';
import SpeedLimits from '../routes/SpeedLimits';
import Downloads from '../routes/Downloads';
import Sharing from '../routes/Sharing';
import View from '../routes/View';
import About from '../routes/About';
import Extensions from '../routes/Extensions';
import System from '../routes/System';

import { ChildSectionType, RootSectionType } from '../types';
import { Navigate, Route, Routes } from 'react-router-dom';
import SettingSection from './SettingSection';
import { getModuleT, getSubModuleT } from 'utils/TranslationUtils';
import { useTranslation } from 'react-i18next';
import { camelCase } from 'lodash';

const SettingsMenu = [
  Profile,
  Connectivity,
  SpeedLimits,
  Downloads,
  Sharing,
  View,
  About,
  Extensions,
  System,
];

export interface SettingsProps {}

const childToRoute = (
  section: ChildSectionType,
  parent: RootSectionType,
  settingsT: UI.ModuleTranslator
) => {
  const url = `${section.url}/*`;
  return (
    <Route
      key={url}
      path={url}
      element={
        <SettingSection
          settingsT={settingsT}
          selectedRootMenuItem={parent}
          rootMenuItems={SettingsMenu}
          selectedChildMenuItem={section}
        >
          <section.component
            settingsT={settingsT}
            moduleT={getSubModuleT(settingsT, camelCase(section.url))}
          />
        </SettingSection>
      }
    />
  );
};

const rootToRoute = (rootSection: RootSectionType, settingsT: UI.ModuleTranslator) => {
  return (
    <Route key={rootSection.url} path={rootSection.url}>
      {rootSection.menuItems.map((child) => childToRoute(child, rootSection, settingsT))}
      {rootSection.advancedMenuItems?.map((child) =>
        childToRoute(child, rootSection, settingsT)
      )}
      <Route index element={<Navigate to={rootSection.menuItems[0].url} />} />
    </Route>
  );
};

// Only to pass menu items to the decorated component
const Settings: React.FC<SettingsProps> = (props) => {
  const { t } = useTranslation();
  const settingsT = getModuleT(t, UI.Modules.SETTINGS);

  return (
    <div className="ui segment settings-layout">
      <Routes>
        <Route index element={<Navigate to={SettingsMenu[0].url} />} />
        {SettingsMenu.map((rootMenuItem) => rootToRoute(rootMenuItem, settingsT))}
      </Routes>
    </div>
  );
};

export default Settings;
