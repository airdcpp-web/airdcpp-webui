import FilelistConstants from '@/constants/FilelistConstants';

import { createFileBundle } from './QueueApi';

import * as API from '@/types/api';
import * as UI from '@/types/ui';
import { APISocket } from '../SocketService';

export const filelistDownloadHandler: UI.DownloadHandler<API.FilelistItem> = (
  { itemInfo, user },
  downloadData,
  socket,
) => {
  const data = {
    user,
    ...downloadData,
  };

  if (itemInfo.type.id === 'file') {
    // File
    const { tth, size, time } = itemInfo;
    return createFileBundle(
      {
        ...data,
        tth,
        size,
        time,
      },
      socket,
    );
  }

  // Directory
  const directoryData = {
    ...data,
    list_path: itemInfo.path,
  };
  return socket.post(FilelistConstants.DIRECTORY_DOWNLOADS_URL, directoryData);
};

export const changeFilelistHubUrl = (
  filelist: API.FilelistSession,
  hubUrl: string,
  socket: APISocket,
) => {
  return socket.patch(`${FilelistConstants.SESSIONS_URL}/${filelist.id}`, {
    hub_url: hubUrl,
  });
};

export const changeFilelistShareProfile = (
  filelist: API.FilelistSession,
  shareProfileId: number,
  socket: APISocket,
) => {
  return socket.patch(`${FilelistConstants.SESSIONS_URL}/${filelist.id}`, {
    share_profile: shareProfileId,
  });
};

export const changeFilelistDirectory = (
  filelist: API.FilelistSession,
  path: string,
  socket: APISocket,
) => {
  return socket.post(`${FilelistConstants.SESSIONS_URL}/${filelist.id}/directory`, {
    list_path: path,
  });
};
