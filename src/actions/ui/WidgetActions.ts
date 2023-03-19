import History from 'utils/History';
import IconConstants from 'constants/IconConstants';

import WidgetActions from 'actions/reflux/WidgetActions';

import * as UI from 'types/ui';

export interface WidgetItemInfo {
  widgetInfo: UI.Widget;
  id: string;
  settings: UI.WidgetSettings;
}

const notAlwaysShow = ({ widgetInfo }: WidgetItemInfo) => !widgetInfo.alwaysShow;

const handleCreate: UI.ActionHandler<UI.Widget> = ({ data: widgetInfo }) => {
  History.push(`/home/widget/${widgetInfo.typeId}`);
};

const handleEdit: UI.ActionHandler<WidgetItemInfo> = ({ data: widgetInfo }) => {
  History.push(`/home/widget/${widgetInfo.widgetInfo.typeId}/${widgetInfo.id}`);
};

const handleRemove: UI.ActionHandler<WidgetItemInfo> = ({ data: widgetInfo }) => {
  WidgetActions.remove(widgetInfo.id);
};

const WidgetCreateActions: UI.ActionListType<UI.Widget> = {
  create: {
    displayName: 'Add widget',
    icon: IconConstants.CREATE,
    handler: handleCreate,
  },
};

const WidgetEditActions: UI.ActionListType<WidgetItemInfo> = {
  edit: {
    displayName: 'Edit widget',
    icon: IconConstants.EDIT,
    handler: handleEdit,
  },
  remove: {
    displayName: 'Remove widget',
    filter: notAlwaysShow,
    icon: IconConstants.REMOVE,
    confirmation: {
      content: 'Are you sure that you want to remove the widget {{item.settings.name}}?',
      approveCaption: 'Remove widget',
      rejectCaption: `Don't remove`,
    },
    handler: handleRemove,
  },
};

export default {
  create: {
    moduleId: UI.Modules.WIDGETS,
    actions: WidgetCreateActions,
  },
  edit: {
    moduleId: UI.Modules.WIDGETS,
    actions: WidgetEditActions,
  },
};
