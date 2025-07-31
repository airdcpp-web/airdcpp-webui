import ShareConstants from '@/constants/ShareConstants';
import { APISocket } from '@/services/SocketService';

import { uploadTempFile } from '../HttpService';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

export interface AddTempShareResponse {
  magnet: string;
}

interface TempFileData {
  file: File;
  hubUrl: string;
  cid?: string;
}

export const shareTempFile = async (
  { file, hubUrl, cid }: TempFileData,
  { auth_token: authToken }: UI.AuthenticatedSession,
  socket: APISocket,
): Promise<AddTempShareResponse> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const fileId = await uploadTempFile(file, authToken);
    const res = await socket.post<AddTempShareResponse>(ShareConstants.TEMP_SHARES_URL, {
      name: file.name,
      file_id: fileId,
      hub_url: hubUrl,
      cid,
    });

    return res;
  } catch (e) {
    throw e;
  }
};

export const refresh = (incoming: boolean, socket: APISocket) => {
  return socket.post(ShareConstants.REFRESH_URL, {
    incoming,
    priority: API.RefreshPriorityTypeEnum.MANUAL,
  });
};

export const refreshPaths = (paths: string[], socket: APISocket) => {
  return socket.post(ShareConstants.REFRESH_PATHS_URL, {
    paths,
    priority: API.RefreshPriorityTypeEnum.MANUAL,
  });
};

export const refreshVirtual = (path: string, socket: APISocket) => {
  return socket.post(ShareConstants.REFRESH_VIRTUAL_URL, {
    path,
  });
};

export const abortRefreshTask = (id: number, socket: APISocket) => {
  return socket.delete(`${ShareConstants.REFRESH_TASKS_URL}/${id}`);
};
