'use strict';
//@ts-ignore
import Reflux from 'reflux';

import History from 'utils/History';
import IconConstants from 'constants/IconConstants';

import * as UI from 'types/ui';
import { Location } from 'history';

export interface WidgetItemInfo { 
  widgetInfo: UI.Widget;
  id: string;
  settings: UI.WidgetSettings;
}

const notAlwaysShow = ({ widgetInfo }: WidgetItemInfo) => !widgetInfo.alwaysShow;
const noData = (item: UI.ActionItemDataValueType) => !item;


const WidgetActionConfig: UI.ActionConfigList<WidgetItemInfo> = [
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
    displayName: 'Remove widget',
    filter: notAlwaysShow,
    icon: IconConstants.REMOVE,
    confirmation: {
      content: 'Are you sure that you want to remove the widget {{item.settings.name}}?',
      approveCaption: 'Remove widget',
      rejectCaption: `Don't remove`,
    }
  } },
];

const WidgetActions = Reflux.createActions(WidgetActionConfig);


WidgetActions.create.listen(function (widgetInfo: UI.Widget, location: Location) {
  History.push(`/home/widget/${widgetInfo.typeId}`);
});

WidgetActions.edit.listen(function ({ id, widgetInfo }: WidgetItemInfo, location: Location) {
  History.push(`/home/widget/${widgetInfo.typeId}/${id}`);
});

export default {
  moduleId: UI.Modules.WIDGETS,
  actions: WidgetActions,
};
