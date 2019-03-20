
import ShareConstants from 'constants/ShareConstants';
import SocketService from 'services/SocketService';

import LoginStore from 'stores/LoginStore';
import { fetchData } from 'utils/HttpUtils';


export interface AddTempShareResponse { 
  magnet: string; 
}

export const shareTempFile = async (
  file: File, hubUrl: string, cid: string | undefined
): Promise<AddTempShareResponse> => {
  let fileId;
  try {
    const res = await fetchData(`${getBasePath()}temp`, {
      method: 'POST',
      headers: {
        'Authorization': LoginStore.authToken,
      },
      body: file
    });

    fileId = res.headers.get('Location');
  } catch (e) {
    throw e;
  }

  try {
    const res = await SocketService.post<AddTempShareResponse>(ShareConstants.TEMP_SHARES_URL, {
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


export const refresh = (incoming: boolean) => {
  return SocketService.post(ShareConstants.REFRESH_URL);
};

export const refreshPaths = (paths: string[]) => {
  return SocketService.post(ShareConstants.REFRESH_PATHS_URL, { 
    paths 
  });
};

export const refreshVirtual = (path: string) => {
  return SocketService.post(ShareConstants.REFRESH_VIRTUAL_URL, { 
    path,
  });
};
