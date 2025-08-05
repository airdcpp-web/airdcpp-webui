import { RootSectionType } from '@/routes/Settings/types';

import * as API from '@/types/api';

import SettingSection from '../../components/SettingSection';

import WebUsersPage from './components/WebUsersPage';
import LoggingPage from './components/LoggingPage';
import ServerSettingsPage from './components/ServerSettingsPage';
import AdvancedServerSettingsPage from './components/AdvancedServerSettingsPage';

const System: RootSectionType = {
  url: 'system',
  title: 'System',
  icon: 'settings',
  access: API.AccessEnum.ADMIN,
  component: SettingSection,
  menuItems: [
    {
      title: 'Users',
      url: 'users',
      noSave: true,
      component: WebUsersPage,
    },
    {
      title: 'Logging',
      url: 'logging',
      component: LoggingPage,
    },
    {
      title: 'Web server',
      url: 'server-settings',
      component: ServerSettingsPage,
    },
  ],
  advancedMenuItems: [
    {
      title: 'Advanced server settings',
      url: 'advanced-server-settings',
      component: AdvancedServerSettingsPage,
    },
  ],
};

export default System;
