'use strict';
import History from 'utils/History';

import IconConstants from 'constants/IconConstants';

import FilelistSessionActions from 'actions/reflux/FilelistSessionActions';
import FilelistSessionStore from 'stores/FilelistSessionStore';

import * as API from 'types/api';
import * as UI from 'types/ui';


const handleBrowseContent: UI.ActionHandler<API.GroupedSearchResult> = ({ data, location }) => {
  FilelistSessionActions.createSession(location, data.users.user, FilelistSessionStore, data.path);
};

const handleResult: UI.ActionHandler<API.GroupedSearchResult> = ({ data, location }) => {
  History.push(`${location.pathname}/result/${data.id}`);
};


const SearchActions: UI.ActionListType<API.GroupedSearchResult> = {
  result: { 
    displayName: 'Result details',
    icon: IconConstants.OPEN,
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
