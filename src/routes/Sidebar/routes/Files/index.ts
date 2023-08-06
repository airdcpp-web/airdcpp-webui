import IconConstants from 'constants/IconConstants';
import ViewFileStore from 'stores/ViewFileStore';
import * as API from 'types/api';
import * as UI from 'types/ui';

export const FileRoutes: UI.RouteItem = {
  title: 'Files',
  path: '/files',
  matchPath: '/files/:session?/:id?',
  icon: IconConstants.FILES_COLORED,
  unreadInfoStore: ViewFileStore,
  access: API.AccessEnum.VIEW_FILE_VIEW,
  lazy: async () => {
    const { default: Component } = await import(
      /* webpackChunkName: "files" */ './components'
    );
    return {
      Component,
    };
  },
};
