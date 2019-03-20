'use strict';
import SearchConstants from 'constants/SearchConstants';
import SocketService from 'services/SocketService';

import * as API from 'types/api';
import * as UI from 'types/ui';


export const searchDownloadHandler: UI.DownloadHandler<API.GroupedSearchResult> = (
  itemInfo, 
  user, 
  downloadData
) => {
  return SocketService.post(`${SearchConstants.RESULTS_URL}/${itemInfo.id}/download`, downloadData);
};
