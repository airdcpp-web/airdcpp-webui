import * as API from 'types/api';

import SocketService from 'services/SocketService';
import QueueConstants from 'constants/QueueConstants';

export const createFileBundle = (data: API.QueueFileBundleDownloadData) => {
  return SocketService.post(`${QueueConstants.BUNDLES_URL}/file`, data);
};

export const setFilePriority = (file: API.QueueFile, priority: API.QueuePriorityEnum) => {
  return SocketService.post(`${QueueConstants.FILES_URL}/${file.id}/priority`, {
    priority,
  });
};

export const setBundlePriority = (
  bundle: API.QueueBundle,
  priority: API.QueuePriorityEnum
) => {
  return SocketService.post(`${QueueConstants.BUNDLES_URL}/${bundle.id}/priority`, {
    priority,
  });
};

export const removeQueueSource = (item: API.QueueSource) => {
  const { user } = item;
  return SocketService.delete(`${QueueConstants.SOURCES_URL}/${user.cid}`);
};
