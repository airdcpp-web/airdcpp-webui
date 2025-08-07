import * as React from 'react';

import * as UI from '@/types/ui';

import { useSessionStoreProperty } from '@/context/SessionStoreContext';
import { useSocket } from '@/context/SocketContext';
import { useAppStoreApi } from '@/context/AppStoreContext';
import { LocalSettings } from '@/constants/LocalSettingConstants';
import { checkUnreadSessionInfo } from '@/utils/SessionUtils';

export const useActiveSession = (
  sessionItem: UI.SessionItem,
  actions: UI.SessionAPIActions<UI.SessionItem>,
  sessionStoreSelector: UI.SessionStoreSelector,
  useReadDelay = false,
) => {
  const appStoreApi = useAppStoreApi();
  const socket = useSocket();
  const userActive = useSessionStoreProperty((state) => state.activity.userActive);
  const activeSessionStoreSetter = useSessionStoreProperty(
    (state) => sessionStoreSelector(state).setActiveSession,
  );

  const readTimeout = React.useRef<number | undefined>(undefined);

  const checkSetRead = (sessionItemRead: UI.SessionItem) => {
    checkUnreadSessionInfo(sessionItemRead, () => {
      actions.setRead(sessionItemRead, socket);
    });

    readTimeout.current = undefined;
  };

  const scheduleCheckSetRead = (sessionItemNew: UI.SessionItem) => {
    const timeout = !useReadDelay
      ? 0
      : appStoreApi
          .getState()
          .settings.getValue<number>(LocalSettings.UNREAD_LABEL_DELAY) * 1000;

    readTimeout.current = window.setTimeout(() => checkSetRead(sessionItemNew), timeout);
  };

  React.useEffect(() => {
    return () => {
      activeSessionStoreSetter(null);
    };
  }, []);

  React.useEffect(() => {
    activeSessionStoreSetter(sessionItem);
    return () => {
      if (readTimeout.current) {
        // Set the previously active session as read
        clearTimeout(readTimeout.current);

        if (sessionItem) {
          checkSetRead(sessionItem);
        }
      }
    };
  }, [sessionItem.id]);

  React.useEffect(() => {
    if (userActive) {
      scheduleCheckSetRead(sessionItem);
    }
  }, [userActive, sessionItem.id]);
};
