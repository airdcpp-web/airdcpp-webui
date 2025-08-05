import { RootSectionType } from '@/routes/Settings/types';

import SettingSection from '../../components/SettingSection';

import ExtensionsManagePage from './components/ExtensionsManagePage';
import ExtensionsBrowsePage from './components/ExtensionsBrowsePage';
import ExtensionsOptionsPage from './components/ExtensionsOptionsPage';
import ExtensionEnginesPage from './components/ExtensionEnginesPage';

const Extensions: RootSectionType = {
  url: 'extensions',
  title: 'Extensions',
  icon: 'puzzle',
  component: SettingSection,
  menuItems: [
    {
      title: 'Manage installed',
      url: 'manage',
      noSave: true,
      component: ExtensionsManagePage,
    },
    {
      title: 'Extension catalog',
      url: 'packages',
      noSave: true,
      component: ExtensionsBrowsePage,
    },
  ],
  advancedMenuItems: [
    {
      title: 'Extension options',
      url: 'extension-options',
      component: ExtensionsOptionsPage,
    },
    {
      title: 'Extension engines',
      url: 'extension-engines',
      component: ExtensionEnginesPage,
    },
  ],
};

export default Extensions;
