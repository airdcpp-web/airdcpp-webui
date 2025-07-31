import * as API from '@/types/api';

import QueueConstants from '@/constants/QueueConstants';
import { APISocket } from '../SocketService';

export const createFileBundle = (
  data: API.QueueFileBundleDownloadData,
  socket: APISocket,
) => {
  return socket.post(`${QueueConstants.BUNDLES_URL}/file`, data);
};

export const setFilePriority = (
  file: API.QueueFile,
  priority: API.QueuePriorityEnum,
  socket: APISocket,
) => {
  return socket.post(`${QueueConstants.FILES_URL}/${file.id}/priority`, {
    priority,
  });
};

export const setBundlePriority = (
  bundle: API.QueueBundle,
  priority: API.QueuePriorityEnum,
  socket: APISocket,
) => {
  return socket.post(`${QueueConstants.BUNDLES_URL}/${bundle.id}/priority`, {
    priority,
  });
};

export const removeQueueSource = (item: API.QueueSource, socket: APISocket) => {
  const { user } = item;
  return socket.delete(`${QueueConstants.SOURCES_URL}/${user.cid}`);
};
