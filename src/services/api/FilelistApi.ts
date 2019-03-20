
import FilelistConstants from 'constants/FilelistConstants';
import QueueConstants from 'constants/QueueConstants';

import SocketService from 'services/SocketService';

import * as API from 'types/api';
import * as UI from 'types/ui';


export const filelistDownloadHandler: UI.DownloadHandler<API.FilelistItem> = (itemInfo, user, downloadData) => {
  const data = {
    user,
    ...downloadData,
  };

  if (itemInfo.type.id === 'file') {
    // File
    const { tth, size, time } = itemInfo;
    return SocketService.post(`${QueueConstants.BUNDLES_URL}/file`, {
      ...data,
      tth,
      size,
      time,
    });
  }

  // Directory
  data['list_path'] = itemInfo.path;
  return SocketService.post(FilelistConstants.DIRECTORY_DOWNLOADS_URL, data);
};
