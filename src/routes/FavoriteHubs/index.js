import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';
import OverlayConstants from 'constants/OverlayConstants';

export default {
  path: '/favorite-hubs',
  component: AsyncComponentDecorator(() => System.import('./components/FavoriteHubs')),
  childRoutes: [
    {
      path: '/favorite-hubs/(new|edit)',
      component: AsyncComponentDecorator(() => System.import('./components/FavoriteHubDialog')),
      overlayId: OverlayConstants.FAVORITE_HUB_MODAL_ID,
    }
  ]
};