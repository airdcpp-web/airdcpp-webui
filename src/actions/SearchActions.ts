'use strict';
//@ts-ignore
import Reflux from 'reflux';
import SearchConstants from 'constants/SearchConstants';
import SocketService from 'services/SocketService';
import History from 'utils/History';

import IconConstants from 'constants/IconConstants';

import AccessConstants from 'constants/AccessConstants';
import FilelistSessionActions from 'actions/FilelistSessionActions';
import FilelistSessionStore from 'stores/FilelistSessionStore';
import NotificationActions from 'actions/NotificationActions';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { ErrorResponse } from 'airdcpp-apisocket';
import { Location } from 'history';


export const SearchActions = Reflux.createActions([
  { 'result': { 
    displayName: 'Result details',
    icon: IconConstants.OPEN 
  } },
  { 'browseContent': { 
    asyncResult: true,	
    displayName: 'Browse content', 
    access: AccessConstants.FILELISTS_EDIT,
    icon: IconConstants.FILELIST
  } },
  { 'download': { asyncResult: true } },
] as UI.ActionConfigList<API.GroupedSearchResult>);

SearchActions.download.listen((
  itemInfo: API.GroupedSearchResult, 
  user: API.HintedUser, 
  downloadData: API.DownloadData
) => {
  return SocketService.post(`${SearchConstants.RESULTS_URL}/${itemInfo.id}/download`, downloadData)
    .then(SearchActions.download.completed)
    .catch(error => SearchActions.download.failed(itemInfo, error));
});

SearchActions.download.failed.listen((itemInfo: API.GroupedSearchResult, error: ErrorResponse) => {
  NotificationActions.apiError(`Failed to queue the item ${itemInfo.name}`, error);
});

SearchActions.browseContent.listen(function (data: API.GroupedSearchResult, location: Location) {
  FilelistSessionActions.createSession(location, data.users.user, FilelistSessionStore, data.path);
});

SearchActions.result.listen(function (data: API.GroupedSearchResult, location: Location) {
  History.push(`${location.pathname}/result/${data.id}`);
});

export default SearchActions;
