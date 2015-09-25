'use strict';
import Reflux from 'reflux';
//import SocketService from '../services/SocketService'

import History from '../utils/History'

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

DownloadActions.downloadTo.listen(function(data, parentRoute) {
    History.pushState({ 
      modal: true,
      downloadHandler: path => data.handler(data.id, path)
    }, '/search/download');
});

export default DownloadActions;