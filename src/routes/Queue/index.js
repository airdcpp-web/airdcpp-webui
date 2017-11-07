import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';
import OverlayConstants from 'constants/OverlayConstants';

export default {
  path: '/queue',
  component: AsyncComponentDecorator(() => System.import('./components/Queue')),
  childRoutes: [
    {
      path: '/queue/sources',
      component: AsyncComponentDecorator(() => System.import('./components/SourceDialog')),
      overlayId: OverlayConstants.BUNDLE_SOURCE_MODAL,
    }, {
      path: '/queue/content',
      component: AsyncComponentDecorator(() => System.import('./components/BundleFileDialog')),
      overlayId: OverlayConstants.BUNDLE_CONTENT_MODAL,
    }
  ]
};
