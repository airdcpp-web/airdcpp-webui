import HubConstants from '@/constants/HubConstants';
import PrivateChatConstants from '@/constants/PrivateChatConstants';
import FilelistConstants from '@/constants/FilelistConstants';
import ViewFileConstants from '@/constants/ViewFileConstants';

import { getMockServer } from 'airdcpp-apisocket/tests';
import EventConstants from '@/constants/EventConstants';
import SystemConstants from '@/constants/SystemConstants';

import * as UI from '@/types/ui';

import { enableMapSet } from 'immer';
import { StoreApi } from 'zustand';
import { initAppStore } from '@/stores';

enableMapSet();

export const addMockStoreSocketListeners = (
  store: StoreApi<UI.Store>,
  initProps: UI.StoreInitData,
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

  initAppStore(store.getState(), initProps);
  return {
    hub,
    privateChat,
    filelist,
    viewFile,

    activity,
    events,
  };
};
