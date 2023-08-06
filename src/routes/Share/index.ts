import IconConstants from 'constants/IconConstants';
import * as API from 'types/api';
import * as UI from 'types/ui';

export const ShareRoutes: UI.RouteItem = {
  title: 'Share',
  path: '/share',
  icon: IconConstants.FOLDER,
  access: API.AccessEnum.SETTINGS_VIEW,
  lazy: async () => {
    const { default: Component } = await import(
      /* webpackChunkName: "share" */ './components'
    );
    return {
      Component,
    };
  },
};
