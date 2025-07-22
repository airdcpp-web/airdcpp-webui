import HubConstants from '@/constants/HubConstants';
import { HubsListResponse } from './api/hubs';

import PrivateChatConstants from '@/constants/PrivateChatConstants';
import { PrivateChatListResponse } from './api/private-chat';

import FilelistConstants from '@/constants/FilelistConstants';
import { FilelistListResponse } from './api/filelist';

import ViewFileConstants from '@/constants/ViewFileConstants';
import { ViewedFilesListResponse } from './api/viewed-files';

import EventConstants from '@/constants/EventConstants';
import { EventCountsResponse } from './api/events';

import SystemConstants from '@/constants/SystemConstants';
import { SystemAwayStateResponse } from './api/system';

import { getMockServer } from 'airdcpp-apisocket/tests';

import * as UI from '@/types/ui';

import { enableMapSet } from 'immer';
import { StoreApi } from 'zustand';
import { initSessionStore } from '@/stores/session';

enableMapSet();

export const addMockStoreSocketListeners = (
  sessionStore: StoreApi<UI.SessionStore>,
  initProps: UI.SessionStoreInitData,
  server: ReturnType<typeof getMockServer>,
) => {
  const addSessionSubscriptionHandlers = (moduleName: string, listenerPrefix: string) => {
    const chatMessage = server.addSubscriptionHandler(
      moduleName,
      `${listenerPrefix}_message`,
    );

    const statusMessage = server.addSubscriptionHandler(
      moduleName,
      `${listenerPrefix}_status`,
    );

    const created = server.addSubscriptionHandler(
      moduleName,
      `${listenerPrefix}_created`,
    );

    const updated = server.addSubscriptionHandler(
      moduleName,
      `${listenerPrefix}_updated`,
    );

    const removed = server.addSubscriptionHandler(
      moduleName,
      `${listenerPrefix}_removed`,
    );

    return {
      chatMessage,
      statusMessage,

      created,
      updated,
      removed,
    };
  };

  const addEventSubscriptionHandlers = () => {
    const message = server.addSubscriptionHandler(
      EventConstants.MODULE_URL,
      EventConstants.MESSAGE,
    );

    const counts = server.addSubscriptionHandler(
      EventConstants.MODULE_URL,
      EventConstants.COUNTS,
    );

    return {
      message,
      counts,
    };
  };

  const addActivitySubscriptionHandlers = () => {
    const awayState = server.addSubscriptionHandler(
      SystemConstants.MODULE_URL,
      SystemConstants.AWAY_STATE,
    );

    return {
      awayState,
    };
  };

  // Sessions
  const hub = addSessionSubscriptionHandlers(HubConstants.MODULE_URL, 'hub');
  const privateChat = addSessionSubscriptionHandlers(
    PrivateChatConstants.MODULE_URL,
    'private_chat',
  );
  const filelist = addSessionSubscriptionHandlers(
    FilelistConstants.MODULE_URL,
    'filelist',
  );
  const viewFile = addSessionSubscriptionHandlers(
    ViewFileConstants.MODULE_URL,
    'view_file',
  );

  // Other
  const events = addEventSubscriptionHandlers();
  const activity = addActivitySubscriptionHandlers();

  initSessionStore(sessionStore.getState(), initProps);
  return {
    hub,
    privateChat,
    filelist,
    viewFile,

    activity,
    events,
  };
};

export const addMockStoreInitDataHandlers = (
  server: ReturnType<typeof getMockServer>,
) => {
  server.addRequestHandler('GET', HubConstants.SESSIONS_URL, HubsListResponse);

  server.addRequestHandler(
    'GET',
    PrivateChatConstants.SESSIONS_URL,
    PrivateChatListResponse,
  );

  server.addRequestHandler('GET', FilelistConstants.SESSIONS_URL, FilelistListResponse);

  server.addRequestHandler(
    'GET',
    ViewFileConstants.SESSIONS_URL,
    ViewedFilesListResponse,
  );

  server.addRequestHandler('GET', EventConstants.COUNTS_URL, EventCountsResponse);

  server.addRequestHandler(
    'GET',
    SystemConstants.AWAY_STATE_URL,
    SystemAwayStateResponse,
  );
};
