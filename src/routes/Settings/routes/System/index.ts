import { RootSectionType } from 'routes/Settings/types';

import * as API from 'types/api';

const System: RootSectionType = {
  url: 'system',
  title: 'System',
  icon: 'settings',
  access: API.AccessEnum.ADMIN,
  component: require('../../components/SettingSection').default,
  menuItems: [
    {
      title: 'Users',
      url: 'users',
      noSave: true,
      component: require('./components/WebUsersPage').default,
    },
    {
      title: 'Logging',
      url: 'logging',
      component: require('./components/LoggingPage').default,
    },
    {
      title: 'Web server',
      url: 'server-settings',
      component: require('./components/ServerSettingsPage').default,
    },
  ],
  advancedMenuItems: [
    {
      title: 'Advanced server settings',
      url: 'advanced-server-settings',
      component: require('./components/AdvancedServerSettingsPage').default,
    },
  ],
};

export default System;
