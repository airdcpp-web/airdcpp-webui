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

const SearchActions: UI.ActionListType<API.GroupedSearchResult> = {
  result: {
    displayName: 'Result details',
    icon: IconConstants.DETAILS,
    handler: handleResult,
  },
  browseContent: {
    displayName: 'Browse content',
    access: API.AccessEnum.FILELISTS_EDIT,
    icon: IconConstants.FILELIST,
    handler: handleBrowseContent,
  },
};

export default {
  moduleId: UI.Modules.SEARCH,
  actions: SearchActions,
};
