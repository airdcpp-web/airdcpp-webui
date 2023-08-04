import FilelistConstants from 'constants/FilelistConstants';

import SocketService from 'services/SocketService';
import { createFileBundle } from './QueueApi';

import * as API from 'types/api';
import * as UI from 'types/ui';

export const filelistDownloadHandler: UI.DownloadHandler<API.FilelistItem> = (
  itemInfo,
  user,
  downloadData,
) => {
  const data = {
    user,
    ...downloadData,
  };

  if (itemInfo.type.id === 'file') {
    // File
    const { tth, size, time } = itemInfo;
    return createFileBundle({
      ...data,
      tth,
      size,
      time,
    });
  }

  // Directory
  const directoryData = {
    ...data,
    list_path: itemInfo.path,
  };
  return SocketService.post(FilelistConstants.DIRECTORY_DOWNLOADS_URL, directoryData);
};

export const changeFilelistHubUrl = (session: API.FilelistSession, hubUrl: string) => {
  return SocketService.patch(`${FilelistConstants.SESSIONS_URL}/${session.id}`, {
    hub_url: hubUrl,
  });
};

export const changeFilelistShareProfile = (
  session: API.FilelistSession,
  shareProfileId: number,
) => {
  return SocketService.patch(`${FilelistConstants.SESSIONS_URL}/${session.id}`, {
    share_profile: shareProfileId,
  });
};

export const changeFilelistDirectory = (session: API.FilelistSession, path: string) => {
  return SocketService.post(`${FilelistConstants.SESSIONS_URL}/${session.id}/directory`, {
    list_path: path,
  });
};
