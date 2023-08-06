import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

export const SettingRoutes: UI.RouteItem = {
  title: 'Settings',
  path: '/settings',
  // matchPath: '/settings/:mainSection?/:childSection?',
  icon: IconConstants.SETTINGS,
  access: API.AccessEnum.SETTINGS_VIEW,
  lazy: async () => {
    const { default: Component } = await import(
      /* webpackChunkName: "settings" */ './components/Settings'
    );
    return {
      Component,
    };
  },
};
