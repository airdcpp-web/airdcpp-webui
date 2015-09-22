'use strict';
import Reflux from 'reflux';
//import SocketService from '../services/SocketService'

export var DownloadActions = Reflux.createActions([
  { "download": { 
  	asyncResult: true,  
  	displayName: "Download", 
  	icon: "green download" } 
  },
  { "downloadTo": { 
    asyncResult: true,  
    displayName: "Download to...", 
    icon: "blue download" } 
  }
]);

DownloadActions.download.listen(function(data) {
    return data.handler(data.id);
});

DownloadActions.downloadTo.listen(function(pattern) {
    var that = this;
    
});

export default DownloadActions;