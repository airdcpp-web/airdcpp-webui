import { useMemo, createContext, useContext, useEffect } from 'react';

import { StoreApi, useStore } from 'zustand';

import * as UI from '@/types/ui';

import { createAppStore, initAppStore } from '@/stores/app';

export const AppStoreContext = createContext<StoreApi<UI.AppStore>>(
  null as unknown as any,
);

type AppStoreContextProviderProps = React.PropsWithChildren;

export const AppStoreProvider: React.FC<AppStoreContextProviderProps> = ({
  children,
}) => {
  const appStore = useMemo(() => {
    const store = createAppStore();
    initAppStore(store.getState());
    return store;
  }, []);

  // Clear state when the connection is lost
  useEffect(() => {
    const initialState = appStore.getInitialState();
    return () => {
      appStore.setState(initialState, true);
    };
  }, []);

  return <AppStoreContext.Provider value={appStore}>{children}</AppStoreContext.Provider>;
};

type AppStoreSelector<T> = (state: UI.AppStore) => T;

export const useAppStoreProperty = <T,>(selector: AppStoreSelector<T>): T => {
  const store = useContext(AppStoreContext);
  if (!store) {
    throw new Error('Missing SessionStoreProvider');
  }

  return useStore(store, selector);
};

export const useAppStore = () => {
  const store = useContext(AppStoreContext);
  if (!store) {
    throw new Error('Missing AppStoreProvider');
  }

  return useStore(store);
};

export const useAppStoreApi = () => {
  const store = useContext(AppStoreContext);
  return store;
};

export const useSession = () => {
  const session = useAppStoreProperty((store) => store.login.getSession());
  return session!;
};
