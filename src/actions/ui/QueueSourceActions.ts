'use strict';
import QueueConstants from 'constants/QueueConstants';
import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';


const handleRemoveSource: UI.ActionHandler<API.User> = (
  { data: user }
) => {
  return SocketService.delete(`${QueueConstants.SOURCES_URL}/${user.cid}`);
};

const QueueSourceActions: UI.ActionListType<API.User> = {
  removeSource: {
    displayName: 'Remove user from queue',
    access: API.AccessEnum.QUEUE_EDIT, 
    icon: IconConstants.REMOVE,
    //filter: removeSource,
    handler: handleRemoveSource,
    notifications: {
      onSuccess: 'The user {{user.nicks}} was removed from {{result.count}} files',
    }
  },
};

export default {
  moduleId: UI.Modules.QUEUE,
  actions: QueueSourceActions,
};
