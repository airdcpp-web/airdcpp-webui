import IconConstants from '@/constants/IconConstants';

import WidgetActions from '@/actions/reflux/WidgetActions';

import * as UI from '@/types/ui';

export interface WidgetItemInfo {
  widgetInfo: UI.Widget;
  id: string;
  settings: UI.WidgetSettings;
}

// Filters
type Filter = UI.ActionFilter<WidgetItemInfo>;
const notAlwaysShow: Filter = ({ itemData }) => !itemData.widgetInfo.alwaysShow;

// Handlers
const handleCreate: UI.ActionHandler<UI.Widget> = ({
  itemData: widgetInfo,
  navigate,
}) => {
  navigate(`/home/widget/${widgetInfo.typeId}`);
};

type Handler = UI.ActionHandler<WidgetItemInfo>;
const handleEdit: Handler = ({ itemData: widgetInfo, navigate }) => {
  navigate(`/home/widget/${widgetInfo.widgetInfo.typeId}/${widgetInfo.id}`);
};

const handleRemove: Handler = ({ itemData: widgetInfo }) => {
  WidgetActions.remove(widgetInfo.id);
};

// Actions
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

// Module
export const WidgetActionModule = {
  moduleId: UI.Modules.WIDGETS,
};

// Menus
const WidgetEditActions: UI.ActionListType<WidgetItemInfo> = {
  edit: WidgetEditAction,
  remove: WidgetRemoveAction,
};

export const WidgetEditActionMenu = {
  moduleData: WidgetActionModule,
  actions: WidgetEditActions,
};
