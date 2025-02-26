import EventConstants from '@/constants/EventConstants';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import IconConstants from '@/constants/IconConstants';

const handleClear: UI.ActionHandler<void> = ({ socket }) => {
  return socket.delete(EventConstants.MESSAGES_URL);
};

export const EventClearAction = {
  id: 'clear',
  displayName: 'Clear',
  access: API.AccessEnum.EVENTS_EDIT,
  icon: IconConstants.CLEAR,
  handler: handleClear,
};

export const EventActions: UI.ActionListType<undefined> = {
  clear: EventClearAction,
};

export const EventActionModule = {
  moduleId: UI.Modules.EVENTS,
};

export const EventActionMenu = {
  moduleData: EventActionModule,
  actions: EventActions,
};
