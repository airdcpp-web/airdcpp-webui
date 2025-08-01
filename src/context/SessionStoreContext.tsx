import { useMemo, createContext, useContext, useEffect } from 'react';

import { StoreApi, useStore } from 'zustand';

import * as UI from '@/types/ui';

import { APISocket } from '@/services/SocketService';
import { createSessionStore, initSessionStore } from '@/stores/session';

export const SessionStoreContext = createContext<StoreApi<UI.SessionStore>>(
  null as unknown as any,
);

export interface SessionStoreInitProps {
  socket: APISocket;
  login: UI.AuthenticatedSession;
}

type SessionStoreContextProviderProps = React.PropsWithChildren<SessionStoreInitProps>;

export const SessionStoreProvider: React.FC<SessionStoreContextProviderProps> = ({
  socket,
  login,
  children,
}) => {
  const sessionStore = useMemo(() => {
    const sessionStoreApi = createSessionStore();

    const initData = {
      socket,
      login,
    };

    initSessionStore(sessionStoreApi, initData);
    return sessionStoreApi;
  }, []);

  // Clear state when the connection is lost
  useEffect(() => {
    const initialState = sessionStore.getInitialState();
    return () => {
      sessionStore.setState(initialState, true);
    };
  }, []);

  return (
    <SessionStoreContext.Provider value={sessionStore}>
      {children}
    </SessionStoreContext.Provider>
  );
};

// interface SessionStoreContextType extends StoreApi<UI.SessionStore> {}

type SessionStoreSelector<T> = (state: UI.SessionStore) => T;

export const useSessionStoreProperty = <T,>(selector: SessionStoreSelector<T>): T => {
  const store = useContext(SessionStoreContext);
  if (!store) {
    throw new Error('Missing SessionStoreProvider');
  }

  return useStore(store, selector);
};

export const useSessionStore = () => {
  const store = useContext(SessionStoreContext);
  if (!store) {
    throw new Error('Missing SessionStoreProvider');
  }

  return useStore(store);
};

export const useSessionStoreApi = () => {
  const store = useContext(SessionStoreContext);
  return store;
};
