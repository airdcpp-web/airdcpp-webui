'use strict';
import Reflux from 'reflux';
import {SEARCH_QUERY_URL, SEARCH_RESULT_URL} from '../constants/SearchConstants';
import SocketService from '../services/SocketService'

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

SearchActions.download.listen((resultId, data) => {
    let that = this;
    return SocketService.post(SEARCH_RESULT_URL + '/' + resultId + '/download', data)
      .then(that.completed)
      .catch(this.failed);
});

export default SearchActions;