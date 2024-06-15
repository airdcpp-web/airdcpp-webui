import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import SearchConstants from 'constants/SearchConstants';

type Filter = UI.ActionFilter<API.SearchType>;
const notDefaultType: Filter = ({ itemData: type }) => !type.default_type;

const handleCreate: UI.ActionHandler<API.SearchType> = ({ navigate }) => {
  navigate(`/types`);
};

const handleEdit: UI.ActionHandler<API.SearchType> = ({ itemData: type, navigate }) => {
  navigate(`types/${type.id}`);
};

const handleRemove: UI.ActionHandler<API.SearchType> = ({ itemData: type }) => {
  return SocketService.delete(`${SearchConstants.SEARCH_TYPES_URL}/${type.id}`);
};

export const SearchTypeCreateAction = {
  id: 'create',
  displayName: 'Add type',
  icon: IconConstants.CREATE,
  handler: handleCreate,
};

export const SearchTypeEditAction = {
  id: 'edit',
  displayName: 'Edit type',
  icon: IconConstants.EDIT,
  handler: handleEdit,
};

export const SearchTypeRemoveAction = {
  id: 'remove',
  displayName: 'Remove type',
  icon: IconConstants.REMOVE,
  confirmation: {
    content: 'Are you sure that you want to remove the search type {{item.name}}?',
    approveCaption: 'Remove type',
    rejectCaption: `Don't remove`,
  },
  filter: notDefaultType,
  handler: handleRemove,
};

const SearchTypeEditActions: UI.ActionListType<API.SearchType> = {
  edit: SearchTypeEditAction,
  remove: SearchTypeRemoveAction,
};

export const SearchTypeActionModule = {
  moduleId: UI.Modules.SETTINGS,
};

export const SearchTypeEditActionMenu = {
  moduleData: SearchTypeActionModule,
  actions: SearchTypeEditActions,
};
