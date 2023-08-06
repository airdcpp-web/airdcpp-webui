import IconConstants from 'constants/IconConstants';
import FilelistSessionStore from 'stores/FilelistSessionStore';

import * as API from 'types/api';
import * as UI from 'types/ui';

export const FilelistRoutes: UI.RouteItem = {
  title: 'Filelists',
  path: '/filelists',
  matchPath: '/filelists/:session?/:id?',
  icon: IconConstants.FILELISTS_COLORED,
  unreadInfoStore: FilelistSessionStore,
  access: API.AccessEnum.FILELISTS_VIEW,
  // lazy: () => import(/* webpackChunkName: "filelists" */ './components/Filelists'),
  lazy: async () => {
    const { default: Component } = await import(
      /* webpackChunkName: "filelists" */ './components'
    );
    return {
      Component,
    };
  },
};
