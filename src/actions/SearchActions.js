'use strict';
import Reflux from 'reflux';
import {SEARCH_QUERY_URL} from '../constants/SearchConstants';
import SocketService from '../services/SocketService'

export var SearchActions = Reflux.createActions([
  { "postSearch": { asyncResult: true} },
    "resetLogCounters"
]);

SearchActions.postSearch.listen(function(pattern) {
    var that = this;
    return SocketService.get(SEARCH_QUERY_URL, { 
	    pattern: pattern
	  })
      .then(that.completed)
      .catch(this.failed);
});

export default SearchActions;