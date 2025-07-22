import { createActivityStore, initActivityStore } from '@/stores/session/activitySlice';

import { createStore } from 'zustand';
import { withLenses } from '@dhmk/zustand-lens';

import * as UI from '@/types/ui';

import { createEventStore, initEventStore } from '@/stores/session/eventSlice';
import createFilelistStore, { initFilelistStore } from '@/stores/session/filelistSlice';
import createViewFileStore, { initViewFileStore } from '@/stores/session/viewFileSlice';
import createPrivateChatStore, {
  initPrivateChatStore,
} from '@/stores/session/privateChatSessionSlice';
import createHubStore, { initHubStore } from '@/stores/session/hubSessionSlice';

export const createSessionStore = () => {
  const store = createStore<UI.SessionStore>(
    withLenses(() => ({
      // Sessions
      hubs: createHubStore(),
      privateChats: createPrivateChatStore(),
      viewFiles: createViewFileStore(),
      filelists: createFilelistStore(),

      // Other
      events: createEventStore(),
      activity: createActivityStore(),
    })),
  );

  return store;
};

export const initSessionStore = (
  sessionStore: UI.SessionStore,
  initData: UI.SessionStoreInitData,
) => {
  initHubStore(sessionStore, initData);
  initPrivateChatStore(sessionStore, initData);
  initFilelistStore(sessionStore, initData);
  initViewFileStore(sessionStore, initData);

  initEventStore(sessionStore, initData);
  initActivityStore(sessionStore, initData);
};
