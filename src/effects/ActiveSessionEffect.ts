import * as React from 'react';

import LocalSettingStore from '@/stores/reflux/LocalSettingStore';
import { LocalSettings } from '@/constants/SettingConstants';

import * as UI from '@/types/ui';

import { useStoreProperty } from '@/context/StoreContext';
import { useSocket } from '@/context/SocketContext';

export const useActiveSession = <SessionT extends UI.SessionType>(
  session: SessionT,
  actions: UI.SessionAPIActions<SessionT>,
  sessionStoreSelector: UI.SessionStoreSelector,
  useReadDelay = false,
) => {
  const socket = useSocket();
  const setActiveSession = useStoreProperty(
    (state) => sessionStoreSelector(state).setActiveSession,
  );

  const readTimeout = React.useRef<number | undefined>(undefined);

  const setRead = (session: SessionT) => {
    actions.setRead(session, socket);
    readTimeout.current = undefined;
  };

  const setSession = (session: SessionT | null) => {
    setActiveSession(session);
    if (!session) {
      return;
    }

    const timeout = !useReadDelay
      ? 0
      : LocalSettingStore.getValue<number>(LocalSettings.UNREAD_LABEL_DELAY) * 1000;

    readTimeout.current = window.setTimeout(() => setRead(session), timeout);
  };

  React.useEffect(() => {
    return () => {
      setSession(null);
    };
  }, []);

  React.useEffect(() => {
    setSession(session);
    return () => {
      if (readTimeout.current) {
        // Set the previously active session as read
        clearTimeout(readTimeout.current);

        if (session) {
          setRead(session);
        }
      }
    };
  }, [session.id]);
};
