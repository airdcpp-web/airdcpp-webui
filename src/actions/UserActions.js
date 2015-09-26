'use strict';
import Reflux from 'reflux';
import {FILELIST_URL} from 'constants/QueueConstants';
import SocketService from 'services/SocketService'

export const UserActions = Reflux.createActions([
   { "message": { 
  	asyncResult: true, 
  	displayName: "Send message", 
  	icon: "mail outline" } 
  },
  { "browse": { 
  	asyncResult: true,  
  	displayName: "Browse share", 
  	icon: "browser" } 
  }
]);

UserActions.message.listen(function(pattern) {
    let that = this;
    /*return SocketService.get(SEARCH_QUERY_URL, { 
	    pattern: pattern
	  })
      .then(that.completed)
      .catch(this.failed);*/
});

UserActions.browse.listen(function(data) {
    let that = this;
    return SocketService.post(FILELIST_URL, data)
      .then(that.completed)
      .catch(this.failed);
});

export default UserActions;