'use strict';
//@ts-ignore
import Reflux from 'reflux';

import ConfirmDialog from 'components/semantic/ConfirmDialog';

import OverlayConstants from 'constants/OverlayConstants';

import History from 'utils/History';
import IconConstants from 'constants/IconConstants';

import * as UI from 'types/ui';
import { Location } from 'history';

interface WidgetItemInfo { 
  widgetInfo: UI.Widget;
  id: string;
  settings: UI.WidgetSettings;
}

const notAlwaysShow = ({ widgetInfo }: WidgetItemInfo) => !widgetInfo.alwaysShow;
const noData = (item: UI.ActionItemDataValueType) => !item;


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

WidgetActions.create.listen(function (widgetInfo: UI.Widget, location: Location) {
  History.pushModal(location, `/home/widget/${widgetInfo.typeId}`, OverlayConstants.HOME_WIDGET_MODAL /*, {
    typeId: widgetInfo.typeId,
  }*/);
});

WidgetActions.edit.listen(function ({ id, widgetInfo }: WidgetItemInfo, location: Location) {
  History.pushModal(location, `/home/widget/${widgetInfo.typeId}/${id}`, OverlayConstants.HOME_WIDGET_MODAL/*, { 
    typeId: widgetInfo.typeId,
    id,
    settings,
  }*/);
});

WidgetActions.remove.listen(function (this: UI.ActionType, { id, settings }: WidgetItemInfo) {
  const options = {
    title: this.displayName,
    content: 'Are you sure that you want to remove the widget ' + settings.name + '?',
    icon: this.icon,
    approveCaption: 'Remove widget',
    rejectCaption: `Don't remove`,
  };

  ConfirmDialog(options, this.confirmed.bind(this, id));
});

export default WidgetActions;
