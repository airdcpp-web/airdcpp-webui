import { useEffect } from 'react';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { HubAPIActions } from '@/actions/store/HubActions';
import { useSessionStoreApi } from '@/context/SessionStoreContext';
import { PrivateChatAPIActions } from '@/actions/store/PrivateChatActions';
import { EventAPIActions } from '@/actions/store/EventActions';
import { ActivityAPIActions } from '@/actions/store/ActivityActions';
import { FilelistAPIActions } from '@/actions/store/FilelistActions';
import { ViewFileAPIActions } from '@/actions/store/ViewFileActions';
import { useSocket } from '@/context/SocketContext';
import { APISocket } from '@/services/SocketService';
import { useSession } from '@/context/AppStoreContext';
import { hasAccess } from '@/utils/AuthUtils';
import { StoreApi } from 'zustand';

const fetchStoreData = async (
  sessionStoreApi: StoreApi<UI.SessionStore>,
  socket: APISocket,
  session: UI.AuthenticatedSession,
) => {
  const sessionStore = sessionStoreApi.getState();
  const promises = [ActivityAPIActions.fetchAway(sessionStore, socket)];
  if (hasAccess(session, API.AccessEnum.PRIVATE_CHAT_VIEW)) {
    promises.push(PrivateChatAPIActions.fetchSessions(sessionStore.privateChats, socket));
  }

  if (hasAccess(session, API.AccessEnum.HUBS_VIEW)) {
    promises.push(HubAPIActions.fetchSessions(sessionStore.hubs, socket));
  }

  if (hasAccess(session, API.AccessEnum.FILELISTS_VIEW)) {
    promises.push(FilelistAPIActions.fetchSessions(sessionStore.filelists, socket));
  }

  if (hasAccess(session, API.AccessEnum.VIEW_FILE_VIEW)) {
    promises.push(ViewFileAPIActions.fetchSessions(sessionStore.viewFiles, socket));
  }

  if (hasAccess(session, API.AccessEnum.EVENTS_VIEW)) {
    promises.push(EventAPIActions.fetchInfo(sessionStore, socket));
  }

  await Promise.all(promises);

  sessionStoreApi.setState({
    initialDataFetched: true,
  });
};

export const useStoreDataFetch = (socketAuthenticated: boolean) => {
  const socket = useSocket();
  const sessionStoreApi = useSessionStoreApi();

  const session = useSession();
  useEffect(() => {
    if (socketAuthenticated) {
      fetchStoreData(sessionStoreApi, socket, session);
    }
  }, [socketAuthenticated]);
};
