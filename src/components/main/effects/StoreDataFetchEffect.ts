import { useEffect } from 'react';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

// import LoginStore, { LoginState } from '@/stores/reflux/LoginStore';

import { HubAPIActions } from '@/actions/store/HubActions';
import { useAppStore } from '@/context/StoreContext';
import { PrivateChatAPIActions } from '@/actions/store/PrivateChatActions';
import { EventAPIActions } from '@/actions/store/EventActions';
import { ActivityAPIActions } from '@/actions/store/ActivityActions';
import { FilelistAPIActions } from '@/actions/store/FilelistActions';
import { ViewFileAPIActions } from '@/actions/store/ViewFileActions';
import { useSocket } from '@/context/SocketContext';
import { APISocket } from '@/services/SocketService';
import { useSession } from '@/context/SessionContext';

const fetchStoreData = (
  store: UI.Store,
  socket: APISocket,
  session: UI.AuthenticatedSession,
) => {
  const { hasAccess } = session;
  if (hasAccess(API.AccessEnum.PRIVATE_CHAT_VIEW)) {
    PrivateChatAPIActions.fetchSessions(store.privateChats, socket);
  }

  if (hasAccess(API.AccessEnum.HUBS_VIEW)) {
    HubAPIActions.fetchSessions(store.hubs, socket);
  }

  if (hasAccess(API.AccessEnum.FILELISTS_VIEW)) {
    FilelistAPIActions.fetchSessions(store.filelists, socket);
  }

  if (hasAccess(API.AccessEnum.VIEW_FILE_VIEW)) {
    ViewFileAPIActions.fetchSessions(store.viewFiles, socket);
  }

  if (hasAccess(API.AccessEnum.EVENTS_VIEW)) {
    EventAPIActions.fetchInfo(store, socket);
  }

  ActivityAPIActions.fetchAway(store, socket);
};

export const useStoreDataFetch = (socketAuthenticated: boolean) => {
  const socket = useSocket();
  const store = useAppStore();

  const session = useSession();

  useEffect(() => {
    if (socketAuthenticated) {
      fetchStoreData(store, socket, session);
    }
  }, [socketAuthenticated]);
};
