import IconConstants from 'constants/IconConstants';

import FilelistSessionActions from 'actions/reflux/FilelistSessionActions';
import FilelistSessionStore from 'stores/FilelistSessionStore';

import * as API from 'types/api';
import * as UI from 'types/ui';

type Handler = UI.ActionHandler<API.GroupedSearchResult>;
const handleBrowseContent: Handler = ({
  itemData: groupedResult,
  location,
  navigate,
}) => {
  const createData = {
    user: groupedResult.users.user,
    path: groupedResult.path,
  };

  return FilelistSessionActions.createSession(createData, {
    location,
    sessionStore: FilelistSessionStore,
    navigate,
  });
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

const SearchActions: UI.ActionListType<API.GroupedSearchResult> = {
  result: SearchResultDetailsAction,
  browseContent: SearchBrowseContentAction,
};

export const SearchActionModule = {
  moduleId: UI.Modules.SEARCH,
};

export const SearchActionMenu = {
  moduleData: SearchActionModule,
  actions: SearchActions,
};
