import * as React from 'react';

import * as UI from '@/types/ui';

import { useSessionStoreProperty } from '@/context/SessionStoreContext';
import { useSocket } from '@/context/SocketContext';
import { useAppStore } from '@/context/AppStoreContext';
import { LocalSettings } from '@/constants/LocalSettingConstants';

export const useActiveSession = <SessionT extends UI.SessionType>(
  sessionItem: SessionT,
  actions: UI.SessionAPIActions<SessionT>,
  sessionStoreSelector: UI.SessionStoreSelector,
  useReadDelay = false,
) => {
  const appStore = useAppStore();
  const socket = useSocket();
  const activeSessionStoreSetter = useSessionStoreProperty(
    (state) => sessionStoreSelector(state).setActiveSession,
  );

  const readTimeout = React.useRef<number | undefined>(undefined);

  const setRead = (sessionItemRead: SessionT) => {
    actions.setRead(sessionItemRead, socket);
    readTimeout.current = undefined;
  };

  const setActiveSession = (sessionItemNew: SessionT | null) => {
    activeSessionStoreSetter(sessionItemNew);
    if (!sessionItemNew) {
      return;
    }

    const timeout = !useReadDelay
      ? 0
      : appStore.settings.getValue<number>(LocalSettings.UNREAD_LABEL_DELAY) * 1000;

    readTimeout.current = window.setTimeout(() => setRead(sessionItemNew), timeout);
  };

  React.useEffect(() => {
    return () => {
      setActiveSession(null);
    };
  }, []);

  React.useEffect(() => {
    setActiveSession(sessionItem);
    return () => {
      if (readTimeout.current) {
        // Set the previously active session as read
        clearTimeout(readTimeout.current);

        if (sessionItem) {
          setRead(sessionItem);
        }
      }
    };
  }, [sessionItem.id]);
};
