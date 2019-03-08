
import ShareConstants from 'constants/ShareConstants';
import SocketService from 'services/SocketService';

import LoginStore from 'stores/LoginStore';


export interface AddTempShareResponse { 
  magnet: string; 
}

export const shareTempFile = async (
  file: File, hubUrl: string, cid: string | undefined
): Promise<AddTempShareResponse> => {
  let fileId;
  try {
    fileId = await fetch(`${getBasePath()}temp`, {
      method: 'POST',
      headers: {
        'Authorization': LoginStore.authToken,
      },
      body: file
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed');
        }

        return res.headers.get('Location');
      });
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