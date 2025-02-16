import { useEffect } from 'react';

import * as UI from 'types/ui';

import LoginStore, { LoginState } from 'stores/reflux/LoginStore';

import { AccessEnum } from 'types/api';
import { HubAPIActions } from 'actions/store/HubActions';
import { useAppStore } from 'context/StoreContext';
import { PrivateChatAPIActions } from 'actions/store/PrivateChatActions';
import { EventAPIActions } from 'actions/store/EventActions';
import { ActivityAPIActions } from 'actions/store/ActivityActions';
import { FilelistAPIActions } from 'actions/store/FilelistActions';
import { ViewFileAPIActions } from 'actions/store/ViewFileActions';

const fetchStoreData = (store: UI.Store) => {
  const { hasAccess } = LoginStore;
  if (hasAccess(AccessEnum.PRIVATE_CHAT_VIEW)) {
    PrivateChatAPIActions.fetchSessions(store.privateChats);
  }

  if (hasAccess(AccessEnum.HUBS_VIEW)) {
    HubAPIActions.fetchSessions(store.hubs);
  }

  if (hasAccess(AccessEnum.FILELISTS_VIEW)) {
    FilelistAPIActions.fetchSessions(store.filelists);
  }

  if (hasAccess(AccessEnum.VIEW_FILE_VIEW)) {
    ViewFileAPIActions.fetchSessions(store.viewFiles);
  }

  if (hasAccess(AccessEnum.EVENTS_VIEW)) {
    EventAPIActions.fetchInfo(store);
  }

  ActivityAPIActions.fetchAway(store);
};

export const useStoreDataFetch = (login: LoginState) => {
  const store = useAppStore();
  useEffect(() => {
    if (login.socketAuthenticated) {
      fetchStoreData(store);
    }
  }, [login.socketAuthenticated]);
};
