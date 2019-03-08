
import ShareConstants from 'constants/ShareConstants';
import SocketService from 'services/SocketService';

import LoginStore from 'stores/LoginStore';


export interface AddTempShareResponse { 
  magnet: string; 
}

export const shareTempFile = async (
  file: File, hubUrl: string, cid: string | undefined
): Promise<AddTempShareResponse> => {
  //this.resetFile();

  /*let contentBase64: string | undefined;
  try {
    contentBase64 = await fileToBase64(file);
  } catch (e) {
    NotificationActions.error({
      title: 'Failed to send the file',
      message: e,
    });

    return;
  }*/

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

        //return res.text();
      });
  } catch (e) {
    //NotificationActions.error({
    //  title: 'Failed to send the file',
    //  message: e,
    //});

    //return null;
    throw e;
  }

  //console.log('File ID', fileId);

  try {
    const res = await SocketService.post<AddTempShareResponse>(ShareConstants.TEMP_SHARES_URL, {
      name: file.name,
      file_id: fileId,
      hub_url: hubUrl,
      cid,
      //content: contentBase64
    });

    return res;
  } catch (e) {
    throw e;
    //const error: ErrorResponse = e;
    //throw error.message;
    //NotificationActions.apiError('Failed to send the file', e);
    //return null;
  }
};