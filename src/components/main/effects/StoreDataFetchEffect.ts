import { useEffect } from 'react';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import LoginStore, { LoginState } from '@/stores/reflux/LoginStore';

import { HubAPIActions } from '@/actions/store/HubActions';
import { useSessionStore } from '@/context/SessionStoreContext';
import { PrivateChatAPIActions } from '@/actions/store/PrivateChatActions';
import { EventAPIActions } from '@/actions/store/EventActions';
import { ActivityAPIActions } from '@/actions/store/ActivityActions';
import { FilelistAPIActions } from '@/actions/store/FilelistActions';
import { ViewFileAPIActions } from '@/actions/store/ViewFileActions';

const fetchStoreData = (sessionStore: UI.SessionStore) => {
  const { hasAccess } = LoginStore;
  if (hasAccess(API.AccessEnum.PRIVATE_CHAT_VIEW)) {
    PrivateChatAPIActions.fetchSessions(sessionStore.privateChats);
  }

  if (hasAccess(API.AccessEnum.HUBS_VIEW)) {
    HubAPIActions.fetchSessions(sessionStore.hubs);
  }

  if (hasAccess(API.AccessEnum.FILELISTS_VIEW)) {
    FilelistAPIActions.fetchSessions(sessionStore.filelists);
  }

  if (hasAccess(API.AccessEnum.VIEW_FILE_VIEW)) {
    ViewFileAPIActions.fetchSessions(sessionStore.viewFiles);
  }

  if (hasAccess(API.AccessEnum.EVENTS_VIEW)) {
    EventAPIActions.fetchInfo(sessionStore);
  }

  ActivityAPIActions.fetchAway(sessionStore);
};

export const useStoreDataFetch = (login: LoginState) => {
  const store = useSessionStore();
  useEffect(() => {
    if (login.socketAuthenticated) {
      fetchStoreData(store);
    }
  }, [login.socketAuthenticated]);
};
