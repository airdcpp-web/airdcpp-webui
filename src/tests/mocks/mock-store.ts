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

export const addMockSessionStoreSocketListeners = (
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

      clear: () => {
        chatMessage.remove();
        statusMessage.remove();

        created.remove();
        updated.remove();
        removed.remove();
      },
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

      clear: () => {
        message.remove();
        counts.remove();
      },
    };
  };

  const addActivitySubscriptionHandlers = () => {
    const awayState = server.addSubscriptionHandler(
      SystemConstants.MODULE_URL,
      SystemConstants.AWAY_STATE,
    );

    return {
      awayState,

      clear: () => {
        awayState.remove();
      },
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

  return {
    hub,
    privateChat,
    filelist,
    viewFile,

    activity,
    events,

    clearSessionMockListeners: () => {
      hub.clear();
      privateChat.clear();
      filelist.clear();
      viewFile.clear();

      activity.clear();
      events.clear();
    },
  };
};

export const addMockSessionStoreInitDataHandlers = (
  server: ReturnType<typeof getMockServer>,
) => {
  const hubs = server.addRequestHandler(
    'GET',
    HubConstants.SESSIONS_URL,
    HubsListResponse,
  );

  const privateChats = server.addRequestHandler(
    'GET',
    PrivateChatConstants.SESSIONS_URL,
    PrivateChatListResponse,
  );

  const filelists = server.addRequestHandler(
    'GET',
    FilelistConstants.SESSIONS_URL,
    FilelistListResponse,
  );

  const viewedFiles = server.addRequestHandler(
    'GET',
    ViewFileConstants.SESSIONS_URL,
    ViewedFilesListResponse,
  );

  const events = server.addRequestHandler(
    'GET',
    EventConstants.COUNTS_URL,
    EventCountsResponse,
  );

  const activity = server.addRequestHandler(
    'GET',
    SystemConstants.AWAY_STATE_URL,
    SystemAwayStateResponse,
  );

  return () => {
    hubs();
    privateChats();
    filelists();
    viewedFiles();

    events();
    activity();
  };
};

export const initMockSessionStore = (
  sessionStore: StoreApi<UI.SessionStore>,
  initProps: UI.SessionStoreInitData,
  server: ReturnType<typeof getMockServer>,
) => {
  addMockSessionStoreInitDataHandlers(server);
  const listeners = addMockSessionStoreSocketListeners(server);

  initSessionStore(sessionStore.getState(), initProps);
  return listeners;
};
