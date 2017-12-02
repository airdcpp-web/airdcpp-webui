import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';
import OverlayConstants from 'constants/OverlayConstants';

export default {
  path: '/share',
  component: AsyncComponentDecorator(() => System.import('./components/Share')),
  childRoutes: [
    {
      path: '/share/(add|edit)',
      component: AsyncComponentDecorator(() => System.import('./components/ShareDirectoryDialog')),
      overlayId: OverlayConstants.SHARE_ROOT_MODAL_ID,
    }
  ]
};