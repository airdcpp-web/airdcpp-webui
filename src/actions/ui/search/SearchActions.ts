import IconConstants from 'constants/IconConstants';

import FilelistSessionActions from 'actions/reflux/FilelistSessionActions';
import FilelistSessionStore from 'stores/FilelistSessionStore';

import * as API from 'types/api';
import * as UI from 'types/ui';

const handleBrowseContent: UI.ActionHandler<API.GroupedSearchResult> = ({
  data,
  location,
  navigate,
}) => {
  const createData = {
    user: data.users.user,
    path: data.path,
  };

  return FilelistSessionActions.createSession(createData, {
    location,
    sessionStore: FilelistSessionStore,
    navigate,
  });
};

const handleResult: UI.ActionHandler<API.GroupedSearchResult> = ({ data, navigate }) => {
  navigate(`result/${data.id}`);
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
