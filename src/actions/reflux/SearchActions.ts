'use strict';
//@ts-ignore
import Reflux from 'reflux';
import SearchConstants from 'constants/SearchConstants';
import SocketService from 'services/SocketService';
import History from 'utils/History';

import NotificationActions from 'actions/NotificationActions';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { ErrorResponse } from 'airdcpp-apisocket';
import { Location } from 'history';


const SearchActionConfig: UI.RefluxActionConfigList<API.GroupedSearchResult> = [
  { 'download': { asyncResult: true } },
  'search'
];

export const SearchActions = Reflux.createActions(SearchActionConfig);

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

SearchActions.search.listen((
  itemInfo: Pick<UI.DownloadableItemInfo, 'tth' | 'type' | 'name'>,
  location: Location
) => {
  const searchString = !itemInfo.tth || itemInfo.type.id === 'directory' ? itemInfo.name : itemInfo.tth;

  History.pushUnique(
    {
      pathname: '/search',
      state: {
        searchString,
      }
    }, 
    location
  );
});

export default SearchActions as UI.RefluxActionListType<void>;
