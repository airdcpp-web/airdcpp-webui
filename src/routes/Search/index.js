import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';
import OverlayConstants from 'constants/OverlayConstants';

export default {
  path: '/search',
  component: AsyncComponentDecorator(() => System.import('./components/Search')),
  childRoutes: [
    {
      path: '/search/(result/)?download',
      component: AsyncComponentDecorator(() => System.import('components/download/DownloadDialog')),
      overlayId: OverlayConstants.DOWNLOAD_MODAL_ID,
    }, {
      path: '/search/result',
      component: AsyncComponentDecorator(() => System.import('./components/ResultDialog')),
      overlayId: OverlayConstants.SEARCH_RESULT_MODAL,
    }
  ]
};