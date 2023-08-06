import ShareConstants from 'constants/ShareConstants';
import SocketService from 'services/SocketService';

import { uploadTempFile } from '../HttpService';

import * as API from 'types/api';

export interface AddTempShareResponse {
  magnet: string;
}

export const shareTempFile = async (
  file: File,
  hubUrl: string,
  cid: string | undefined,
): Promise<AddTempShareResponse> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const fileId = await uploadTempFile(file);
    const res = await SocketService.post<AddTempShareResponse>(
      ShareConstants.TEMP_SHARES_URL,
      {
        name: file.name,
        file_id: fileId,
        hub_url: hubUrl,
        cid,
      },
    );

    return res;
  } catch (e) {
    throw e;
  }
};

export const refresh = (incoming: boolean) => {
  return SocketService.post(ShareConstants.REFRESH_URL, {
    incoming,
    priority: API.RefreshPriorityTypeEnum.MANUAL,
  });
};

export const refreshPaths = (paths: string[]) => {
  return SocketService.post(ShareConstants.REFRESH_PATHS_URL, {
    paths,
    priority: API.RefreshPriorityTypeEnum.MANUAL,
  });
};

export const refreshVirtual = (path: string) => {
  return SocketService.post(ShareConstants.REFRESH_VIRTUAL_URL, {
    path,
  });
};

export const abortRefreshTask = (id: number) => {
  return SocketService.delete(`${ShareConstants.REFRESH_TASKS_URL}/${id}`);
};
