import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import SearchConstants from 'constants/SearchConstants';

const handleCreate: UI.ActionHandler<API.SearchType> = ({ location, history }) => {
  history.push(`${location.pathname}/types`);
};

const handleEdit: UI.ActionHandler<API.SearchType> = ({
  data: type,
  location,
  history,
}) => {
  history.push(`${location.pathname}/types/${type.id}`);
};

const handleRemove: UI.ActionHandler<API.SearchType> = ({ data: type }) => {
  return SocketService.delete(`${SearchConstants.SEARCH_TYPES_URL}/${type.id}`);
};

const SearchTypeCreateActions: UI.ActionListType<API.SearchType> = {
  create: {
    displayName: 'Add type',
    access: API.AccessEnum.SETTINGS_EDIT,
    icon: IconConstants.CREATE,
    handler: handleCreate,
  },
};

const SearchTypeEditActions: UI.ActionListType<API.SearchType> = {
  edit: {
    displayName: 'Edit type',
    access: API.AccessEnum.SETTINGS_EDIT,
    icon: IconConstants.EDIT,
    handler: handleEdit,
  },
  remove: {
    displayName: 'Remove type',
    access: API.AccessEnum.SETTINGS_EDIT,
    icon: IconConstants.REMOVE,
    confirmation: {
      content: 'Are you sure that you want to remove the search type {{item.name}}?',
      approveCaption: 'Remove type',
      rejectCaption: `Don't remove`,
    },
    filter: (type) => !type.default_type,
    handler: handleRemove,
  },
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
