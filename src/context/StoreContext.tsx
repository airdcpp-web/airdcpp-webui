import { useMemo, createContext, useContext, useEffect } from 'react';

import { StoreApi, useStore } from 'zustand';

import * as UI from '@/types/ui';

import { APISocket } from '@/services/SocketService';
import { createAppStore, initAppStore } from '@/stores';

export const StoreContext = createContext<StoreApi<UI.Store>>(null as unknown as any);

export interface StoreInitProps {
  socket: APISocket;
  login: UI.AuthenticatedSession;
}

type StoreContextProviderProps = React.PropsWithChildren<StoreInitProps>;

export const StoreProvider: React.FC<StoreContextProviderProps> = ({
  socket,
  login,
  children,
}) => {
  const store = useMemo(() => {
    const store = createAppStore();

    const initData = {
      socket,
      login,
    };

    initAppStore(store.getState(), initData);
    return store;
  }, []);

  // Clear state when the connection is lost
  useEffect(() => {
    const initialState = store.getInitialState();
    return () => {
      store.setState(initialState, true);
    };
  }, []);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

interface StoreContextType extends StoreApi<UI.Store> {}

type Selector<T> = (state: UI.Store) => T;

export const useStoreProperty = <T,>(selector: Selector<T>): T => {
  const store = useContext<StoreContextType>(StoreContext);
  if (!store) {
    throw new Error('Missing StoreProvider');
  }

  return useStore(store, selector);
};

export const useAppStore = () => {
  const store = useContext<StoreContextType>(StoreContext);
  if (!store) {
    throw new Error('Missing StoreProvider');
  }

  return useStore(store);
};

export const useStoreApi = () => {
  const store = useContext<StoreContextType>(StoreContext);
  return store;
};
