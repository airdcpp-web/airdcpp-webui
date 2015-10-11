'use strict';
import Reflux from 'reflux';
import {SEARCH_QUERY_URL, SEARCH_RESULT_URL} from 'constants/SearchConstants';
import SocketService from 'services/SocketService'

import NotificationActions from 'actions/NotificationActions'

export const SearchActions = Reflux.createActions([
  { "postSearch": { asyncResult: true} },
  { "download": { 
  	asyncResult: true,  
  	displayName: "Download", 
  	icon: "green download" } 
  }
]);

SearchActions.postSearch.listen(function(pattern) {
    let that = this;
    return SocketService.get(SEARCH_QUERY_URL, { 
	    pattern: pattern
	  })
      .then(that.completed)
      .catch(this.failed);
});

SearchActions.download.listen((searchResult, data) => {
    return SocketService.post(SEARCH_RESULT_URL + '/' + searchResult.id + '/download', data)
      .then(SearchActions.download.completed)
      .catch(error => SearchActions.download.failed(searchResult, error));
});

SearchActions.download.failed.listen((searchResult, error) => {
  NotificationActions.error({
    title: searchResult.itemInfo.name,
    message: "Failed to queue the item: " + error.reason
  });
});

export default SearchActions;