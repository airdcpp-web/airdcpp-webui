import IconConstants from '@/constants/IconConstants';
import { HomeLayoutStore } from '@/routes/Home/stores/homeLayoutSlice';

// import WidgetActions from '@/actions/reflux/WidgetActions';

import * as UI from '@/types/ui';

/*export interface WidgetItemInfo {
  widgetInfo: UI.Widget;
  settings: UI.WidgetSettings;
}*/

export interface WidgetActionItemData {
  id: string;
  widgetInfo: UI.Widget;
  settings: UI.WidgetSettings;
  layoutStore: HomeLayoutStore;
}

// Filters
type Filter = UI.ActionFilter<WidgetActionItemData>;
const notAlwaysShow: Filter = ({ itemData: { widgetInfo } }) => !widgetInfo.alwaysShow;

// Handlers
const handleCreate: UI.ActionHandler<UI.Widget> = ({
  itemData: widgetInfo,
  navigate,
}) => {
  navigate(`/home/widget/${widgetInfo.typeId}`);
};

type Handler = UI.ActionHandler<WidgetActionItemData>;
const handleEdit: Handler = ({ itemData: { id, widgetInfo }, navigate }) => {
  navigate(`/home/widget/${widgetInfo.typeId}/${id}`);
};

const handleRemove: Handler = ({ itemData: { id, layoutStore } }) => {
  layoutStore.removeWidget(id);
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
const WidgetEditActions: UI.ActionListType<WidgetActionItemData> = {
  edit: WidgetEditAction,
  remove: WidgetRemoveAction,
};

export const WidgetEditActionMenu = {
  moduleData: WidgetActionModule,
  actions: WidgetEditActions,
};
