'use strict';
import Reflux from 'reflux';
//import SocketService from 'services/SocketService'

import History from 'utils/History'

export const DownloadActions = Reflux.createActions([
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

DownloadActions.downloadTo.listen(function(handlerData, parentRoute) {
    History.pushState({ 
      modal: true,
      downloadHandler: downloadData => handlerData.handler(handlerData.id, downloadData),
      itemInfo:handlerData.itemInfo
    }, '/search/download');
});

export default DownloadActions;