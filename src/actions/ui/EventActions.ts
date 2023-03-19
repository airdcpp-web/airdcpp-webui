import EventConstants from 'constants/EventConstants';
import SocketService from 'services/SocketService';
import AccessConstants from 'constants/AccessConstants';

import * as UI from 'types/ui';
import IconConstants from 'constants/IconConstants';

export const EventActions: UI.ActionListType<undefined> = {
  clear: {
    displayName: 'Clear',
    access: AccessConstants.EVENTS_EDIT,
    icon: IconConstants.CLEAR,
    handler: () => {
      return SocketService.delete(EventConstants.MESSAGES_URL);
    },
  },
};

export default {
  moduleId: UI.Modules.EVENTS,
  actions: EventActions,
};
