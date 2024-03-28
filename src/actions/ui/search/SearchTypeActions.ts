import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import SearchConstants from 'constants/SearchConstants';

const handleCreate: UI.ActionHandler<API.SearchType> = ({ navigate }) => {
  navigate(`/types`);
};

const handleEdit: UI.ActionHandler<API.SearchType> = ({ data: type, navigate }) => {
  navigate(`types/${type.id}`);
};

const handleRemove: UI.ActionHandler<API.SearchType> = ({ data: type }) => {
  return SocketService.delete(`${SearchConstants.SEARCH_TYPES_URL}/${type.id}`);
};

const SearchTypeCreateAction = {
  id: 'create',
  displayName: 'Add type',
  icon: IconConstants.CREATE,
  handler: handleCreate,
};

const SearchTypeEditAction = {
  id: 'edit',
  displayName: 'Edit type',
  icon: IconConstants.EDIT,
  handler: handleEdit,
};

const SearchTypeRemoveAction = {
  id: 'remove',
  displayName: 'Remove type',
  icon: IconConstants.REMOVE,
  confirmation: {
    content: 'Are you sure that you want to remove the search type {{item.name}}?',
    approveCaption: 'Remove type',
    rejectCaption: `Don't remove`,
  },
  filter: (type: API.SearchType) => !type.default_type,
  handler: handleRemove,
};

const SearchTypeCreateActions: UI.ActionListType<API.SearchType> = {
  create: SearchTypeCreateAction,
};

const SearchTypeEditActions: UI.ActionListType<API.SearchType> = {
  edit: SearchTypeEditAction,
  remove: SearchTypeRemoveAction,
};

export default {
  create: {
    moduleId: UI.Modules.SETTINGS,
    subId: 'searchType',
    actions: SearchTypeCreateActions,
  },
  edit: {
    moduleId: UI.Modules.SETTINGS,
    subId: 'searchType',
    actions: SearchTypeEditActions,
  },
};
