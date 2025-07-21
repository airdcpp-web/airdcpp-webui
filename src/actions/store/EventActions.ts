import EventConstants from '@/constants/EventConstants';
import { APISocket } from '@/services/SocketService';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import NotificationActions from '@/actions/NotificationActions';
import { ErrorResponse } from 'airdcpp-apisocket';

const fetchInfo = async (store: UI.Store, socket: APISocket) => {
  let eventInfo: API.StatusMessageCounts | null = null;
  try {
    eventInfo = await socket.get<API.StatusMessageCounts>(EventConstants.COUNTS_URL);
  } catch (e) {
    const error: ErrorResponse = e;
    NotificationActions.apiError('Failed to fetch event info', error);
    return;
  }

  store.events.onMessageCountsReceived(eventInfo);
};

const fetchMessages = async (store: UI.Store, socket: APISocket) => {
  let messages: API.StatusMessage[] | null = null;
  try {
    messages = await socket.get<API.StatusMessage[]>(`${EventConstants.MESSAGES_URL}/0`);
  } catch (e) {
    const error: ErrorResponse = e;
    NotificationActions.apiError('Failed to fetch event info', error);
    return;
  }

  store.events.onMessagesFetched(messages);
};

const setRead = (socket: APISocket) => {
  return socket.post(EventConstants.READ_URL);
};

export const EventAPIActions = {
  fetchInfo,
  fetchMessages,
  setRead,
};
