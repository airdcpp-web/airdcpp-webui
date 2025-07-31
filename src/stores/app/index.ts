import { createStore } from 'zustand';
import { withLenses } from '@dhmk/zustand-lens';

import * as UI from '@/types/ui';

import { createLocalSettingStore, initLocalSettingStore } from './localSettingSlice';
import { createLoginStore, initLoginStore } from './loginSlice';

export const createAppStore = () => {
  const store = createStore<UI.AppStore>(
    withLenses(() => ({
      login: createLoginStore(),
      settings: createLocalSettingStore(),
    })),
  );

  return store;
};

export const initAppStore = (appStore: UI.AppStore) => {
  initLocalSettingStore(appStore);
  initLoginStore(appStore);
};
