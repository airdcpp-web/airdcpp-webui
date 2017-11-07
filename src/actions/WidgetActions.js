'use strict';
import Reflux from 'reflux';

import ConfirmDialog from 'components/semantic/ConfirmDialog';

import OverlayConstants from 'constants/OverlayConstants';

import History from 'utils/History';
import IconConstants from 'constants/IconConstants';


const notAlwaysShow = ({ widgetInfo }) => !widgetInfo.alwaysShow;
const noData = item => !item;


const WidgetActions = Reflux.createActions([
  { 'create': { 
    displayName: 'Add widget',
    children: [ 'saved' ], 
    icon: IconConstants.CREATE,
    filter: noData,
  } },
  { 'edit': { 
    displayName: 'Edit widget',
    children: [ 'saved' ], 
    icon: IconConstants.EDIT,
  } },
  { 'remove': { 
    asyncResult: true, 
    children: [ 'confirmed' ], 
    displayName: 'Remove widget',
    filter: notAlwaysShow,
    icon: IconConstants.REMOVE,
  } },
]);

WidgetActions.create.listen(function (widgetInfo, location) {
  History.pushModal(location, '/home/widget', OverlayConstants.HOME_WIDGET_MODAL, {
    typeId: widgetInfo.typeId,
  });
});

WidgetActions.edit.listen(function ({ id, widgetInfo, settings }, location) {
  History.pushModal(location, '/home/widget', OverlayConstants.HOME_WIDGET_MODAL, { 
    typeId: widgetInfo.typeId,
    id,
    settings,
  });
});

WidgetActions.remove.listen(function ({ id, settings }) {
  const options = {
    title: this.displayName,
    content: 'Are you sure that you want to remove the widget ' + settings.name + '?',
    icon: this.icon,
    approveCaption: 'Remove widget',
    rejectCaption: "Don't remove",
  };

  ConfirmDialog(options, this.confirmed.bind(this, id));
});

export default WidgetActions;
