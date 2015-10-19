'use strict';
import Reflux from 'reflux';
import {FILELIST_URL} from 'constants/QueueConstants';
import SocketService from 'services/SocketService'

import PrivateChatActions from 'actions/PrivateChatActions'
import FilelistActions from 'actions/FilelistActions'

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

UserActions.message.listen(function(userData, location) {
    PrivateChatActions.createSession(userData.user, location);
});

UserActions.browse.listen(function(userData, location) {
    FilelistActions.createSession(userData.user, location, userData.directory);
});

export default UserActions;