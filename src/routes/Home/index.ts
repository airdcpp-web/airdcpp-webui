import IconConstants from 'constants/IconConstants';

import * as UI from 'types/ui';

export const HOME_URL = '/home';

export const HomeRoutes: UI.RouteItem = {
  title: 'Home',
  path: HOME_URL,
  icon: IconConstants.HOME,
  lazy: async () => {
    const { default: Component } = await import(
      /* webpackChunkName: "home" */ './components'
    );
    return {
      Component,
    };
  },
};
