import * as API from 'types/api';
import * as UI from 'types/ui';

import IconConstants from 'constants/IconConstants';

export const TransferRoutes: UI.RouteItem = {
  title: 'Transfers',
  path: '/transfers',
  icon: IconConstants.TRANSFERS_COLORED,
  access: API.AccessEnum.TRANSFERS,
  lazy: async () => {
    const { default: Component } = await import(
      /* webpackChunkName: "messages" */ './components'
    );
    return {
      Component,
    };
  },
};
