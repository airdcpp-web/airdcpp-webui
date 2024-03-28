import IconConstants from 'constants/IconConstants';

import WidgetActions from 'actions/reflux/WidgetActions';

import * as UI from 'types/ui';

export interface WidgetItemInfo {
  widgetInfo: UI.Widget;
  id: string;
  settings: UI.WidgetSettings;
}

const notAlwaysShow = ({ widgetInfo }: WidgetItemInfo) => !widgetInfo.alwaysShow;

const handleCreate: UI.ActionHandler<UI.Widget> = ({ data: widgetInfo, navigate }) => {
  navigate(`/home/widget/${widgetInfo.typeId}`);
};

const handleEdit: UI.ActionHandler<WidgetItemInfo> = ({ data: widgetInfo, navigate }) => {
  navigate(`/home/widget/${widgetInfo.widgetInfo.typeId}/${widgetInfo.id}`);
};

const handleRemove: UI.ActionHandler<WidgetItemInfo> = ({ data: widgetInfo }) => {
  WidgetActions.remove(widgetInfo.id);
};

export const WidgetCreateAction = {
  id: 'create',
  displayName: 'Add widget',
  icon: IconConstants.CREATE,
  handler: handleCreate,
};

export const WidgetEditAction = {
  id: 'edit',
  displayName: 'Edit widget',
  icon: IconConstants.EDIT,
  handler: handleEdit,
};

export const WidgetRemoveAction = {
  id: 'remove',
  displayName: 'Remove widget',
  filter: notAlwaysShow,
  icon: IconConstants.REMOVE,
  confirmation: {
    content: 'Are you sure that you want to remove the widget {{item.settings.name}}?',
    approveCaption: 'Remove widget',
    rejectCaption: `Don't remove`,
  },
  handler: handleRemove,
};

const WidgetCreateActions: UI.ActionListType<UI.Widget> = {
  create: WidgetCreateAction,
};

const WidgetEditActions: UI.ActionListType<WidgetItemInfo> = {
  edit: WidgetEditAction,
  remove: WidgetRemoveAction,
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
