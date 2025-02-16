import { FilelistAPIActions } from 'actions/store/FilelistActions';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

type Handler = UI.ActionHandler<API.GroupedSearchResult>;

const handleBrowseContent: Handler = ({ itemData: groupedResult, ...other }) => {
  const createData = {
    user: groupedResult.users.user,
    path: groupedResult.path,
  };

  return FilelistAPIActions.createRemoteSession(createData, other);
};

const handleResult: Handler = ({ itemData: groupedResult, navigate }) => {
  navigate(`result/${groupedResult.id}`);
};

export const SearchResultDetailsAction = {
  id: 'result',
  displayName: 'Result details',
  icon: IconConstants.DETAILS,
  handler: handleResult,
};

export const SearchBrowseContentAction = {
  id: 'browseContent',
  displayName: 'Browse content',
  icon: IconConstants.FILELIST,
  handler: handleBrowseContent,
};

const GroupedSearchResultActions: UI.ActionListType<API.GroupedSearchResult> = {
  result: SearchResultDetailsAction,
  browseContent: SearchBrowseContentAction,
};

export const SearchActionModule = {
  moduleId: UI.Modules.SEARCH,
};

export const GroupedSearchResultActionMenu = {
  moduleData: SearchActionModule,
  actions: GroupedSearchResultActions,
};

const SearchActions: UI.ActionListType<API.SearchInstance> = {};

export const SearchActionMenu = {
  moduleData: SearchActionModule,
  actions: SearchActions,
};
