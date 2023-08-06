import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

export const FavoriteHubRoutes: UI.RouteItem = {
  title: 'Favorite hubs',
  path: '/favorite-hubs',
  icon: IconConstants.FAVORITE,
  access: API.AccessEnum.FAVORITE_HUBS_VIEW,
  lazy: async () => {
    const { default: Component } = await import(
      /* webpackChunkName: "favorite-hubs" */ './components'
    );
    return {
      Component,
    };
  },
  //children: [
  //  {
  //    path: 'entries/:entryId?',
  //    lazy: async () => {
  //      const { FavoriteHubDialog: Component } = await import(
  //        /* webpackChunkName: "favorite-hubs" */ './components'
  //      );
  //      return {
  //        Component,
  //      };
  //    },
  //  },
  //],
};
