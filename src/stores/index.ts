import { createActivityStore, initActivityStore } from '@/stores/activitySlice';

import { createStore } from 'zustand';
import { withLenses } from '@dhmk/zustand-lens';

import * as UI from '@/types/ui';

import { createEventStore, initEventStore } from '@/stores/eventSlice';
import createFilelistStore, { initFilelistStore } from '@/stores/filelistSlice';
import createViewFileStore, { initViewFileStore } from '@/stores/viewFileSlice';
import createPrivateChatStore, {
  initPrivateChatStore,
} from '@/stores/privateChatSessionSlice';
import createHubStore, { initHubStore } from '@/stores/hubSessionSlice';

export const createAppStore = () => {
  const store = createStore<UI.Store>(
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

export const initAppStore = (store: UI.Store, initData: UI.StoreInitData) => {
  initHubStore(store, initData);
  initPrivateChatStore(store, initData);
  initFilelistStore(store, initData);
  initViewFileStore(store, initData);

  initEventStore(store, initData);
  initActivityStore(store, initData);
};
