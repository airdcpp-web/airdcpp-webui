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
    return data.handler(data);
});

DownloadActions.downloadTo.listen(function(handlerData) {
  const { pathname } = handlerData.location;
  
  History.pushModal(handlerData.location, pathname + '/download', DOWNLOAD_MODAL_ID, {
    downloadHandler: downloadData => handlerData.handler(handlerData, downloadData),
    itemInfo:handlerData.itemInfo
  });
});

export default DownloadActions;