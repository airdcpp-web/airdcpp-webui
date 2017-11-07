import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';
import OverlayConstants from 'constants/OverlayConstants';

export default {
  path: '/(home/widget)?',
  exact: true,
  component: AsyncComponentDecorator(() => System.import('./components/Home')),
  childRoutes: [
	  {
	    path: '/home/widget', 
	    component: AsyncComponentDecorator(() => System.import('./components/WidgetDialog')),
	    overlayId: OverlayConstants.HOME_WIDGET_MODAL,
	  } 
  ]
};