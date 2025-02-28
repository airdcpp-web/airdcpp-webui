import { createStore } from 'zustand';
import { withLenses } from '@dhmk/zustand-lens';

import * as UI from '@/types/ui';

import { createLocalSettingStore, initLocalSettingStore } from './localSettingSlice';

export const createAppStore = () => {
  const store = createStore<UI.AppStore>(
    withLenses(() => ({
      // Sessions
      settings: createLocalSettingStore(),
    })),
  );

  return store;
};

export const initAppStore = (
  appStore: UI.AppStore,
  // initData: UI.SessionStoreInitData,
) => {
  initLocalSettingStore(appStore);
};
