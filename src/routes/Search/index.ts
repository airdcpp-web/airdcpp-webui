import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

export const SearchRoutes: UI.RouteItem = {
  title: 'Search',
  path: '/search',
  icon: IconConstants.SEARCH,
  access: API.AccessEnum.SEARCH,
  lazy: async () => {
    const { default: Component } = await import(
      /* webpackChunkName: "search" */ './components'
    );
    return {
      Component,
    };
  },
};
