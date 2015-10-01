'use strict';
import Reflux from 'reflux';
//import SocketService from 'services/SocketService'

import History from 'utils/History'
import { DOWNLOAD_MODAL_ID } from 'constants/OverlayConstants'

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

DownloadActions.downloadTo.listen(function(handlerData) {
  const { pathname } = handlerData.location;
  
  History.pushOverlay(pathname, '/download', DOWNLOAD_MODAL_ID, {
    downloadHandler: downloadData => handlerData.handler(handlerData.id, downloadData),
    itemInfo:handlerData.itemInfo
  });
});

export default DownloadActions;