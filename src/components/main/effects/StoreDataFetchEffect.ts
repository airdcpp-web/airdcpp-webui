import { useEffect } from 'react';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { HubAPIActions } from '@/actions/store/HubActions';
import { useSessionStore } from '@/context/SessionStoreContext';
import { PrivateChatAPIActions } from '@/actions/store/PrivateChatActions';
import { EventAPIActions } from '@/actions/store/EventActions';
import { ActivityAPIActions } from '@/actions/store/ActivityActions';
import { FilelistAPIActions } from '@/actions/store/FilelistActions';
import { ViewFileAPIActions } from '@/actions/store/ViewFileActions';
import { useSocket } from '@/context/SocketContext';
import { APISocket } from '@/services/SocketService';
import { useSession } from '@/context/SessionContext';

const fetchStoreData = (
  sessionStore: UI.SessionStore,
  socket: APISocket,
  session: UI.AuthenticatedSession,
) => {
  const { hasAccess } = session;
  if (hasAccess(API.AccessEnum.PRIVATE_CHAT_VIEW)) {
    PrivateChatAPIActions.fetchSessions(sessionStore.privateChats, socket);
  }

  if (hasAccess(API.AccessEnum.HUBS_VIEW)) {
    HubAPIActions.fetchSessions(sessionStore.hubs, socket);
  }

  if (hasAccess(API.AccessEnum.FILELISTS_VIEW)) {
    FilelistAPIActions.fetchSessions(sessionStore.filelists, socket);
  }

  if (hasAccess(API.AccessEnum.VIEW_FILE_VIEW)) {
    ViewFileAPIActions.fetchSessions(sessionStore.viewFiles, socket);
  }

  if (hasAccess(API.AccessEnum.EVENTS_VIEW)) {
    EventAPIActions.fetchInfo(sessionStore, socket);
  }

  ActivityAPIActions.fetchAway(sessionStore, socket);
};

export const useStoreDataFetch = (socketAuthenticated: boolean) => {
  const socket = useSocket();
  const sessionStore = useSessionStore();

  const session = useSession();
  useEffect(() => {
    if (socketAuthenticated) {
      fetchStoreData(sessionStore, socket, session);
    }
  }, [socketAuthenticated]);
};
