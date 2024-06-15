import QueueConstants from 'constants/QueueConstants';
import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

const handleRemoveSource: UI.ActionHandler<API.User> = ({ itemData: user }) => {
  return SocketService.delete(`${QueueConstants.SOURCES_URL}/${user.cid}`);
};

export const QueueSourceRemoveAction = {
  id: 'removeSource',
  displayName: 'Remove user from queue',
  access: API.AccessEnum.QUEUE_EDIT,
  icon: IconConstants.REMOVE,
  handler: handleRemoveSource,
  notifications: {
    onSuccess: 'The user {{user.nicks}} was removed from {{result.count}} files',
  },
};

const QueueSourceActions: UI.ActionListType<API.User> = {
  removeSource: QueueSourceRemoveAction,
};

export const QueueSourceActionModule = {
  moduleId: UI.Modules.QUEUE,
};

export const QueueSourceActionMenu = {
  moduleData: QueueSourceActionModule,
  actions: QueueSourceActions,
};
