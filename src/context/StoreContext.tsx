import { useMemo, createContext, useContext, useEffect } from 'react';
import { createActivityStore } from 'stores/activitySlice';

import { createStore, StoreApi, useStore } from 'zustand';
import { withLenses } from '@dhmk/zustand-lens';

import * as UI from 'types/ui';

import { createEventStore } from 'stores/eventSlice';
import { APISocket } from 'services/SocketService';
import createFilelistStore from 'stores/filelistSlice';
import createViewFileStore from 'stores/viewFileSlice';
import createPrivateChatStore from 'stores/privateChatSessionSlice';
import createHubStore from 'stores/hubSessionSlice';

const StoreContext = createContext<StoreApi<UI.Store>>(null as unknown as any);

export interface StoreInitProps {
  socket: APISocket;
  login: UI.AuthenticatedSession;
}

type StoreContextProviderProps = React.PropsWithChildren<StoreInitProps>;

export const createAppStore = (initData: StoreInitProps) => {
  /*const initData = {
    socket,
    login,
  };*/

  return createStore<UI.Store>(
    withLenses(() => ({
      // Sessions
      hubs: createHubStore(initData),
      privateChats: createPrivateChatStore(initData),
      viewFiles: createViewFileStore(initData),
      filelists: createFilelistStore(initData),

      // Other
      events: createEventStore(initData),
      activity: createActivityStore(initData),
    })),
  );
};

export const StoreProvider: React.FC<StoreContextProviderProps> = ({
  socket,
  login,
  children,
}) => {
  const store = useMemo(() => {
    return createAppStore({
      socket,
      login,
    });
  }, []);

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
