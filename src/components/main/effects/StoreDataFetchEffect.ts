import { useEffect } from 'react';

import LoginStore, { LoginState } from 'stores/reflux/LoginStore';

import HubActions from 'actions/reflux/HubActions';
import PrivateChatActions from 'actions/reflux/PrivateChatActions';
import FilelistSessionActions from 'actions/reflux/FilelistSessionActions';
import ViewFileActions from 'actions/reflux/ViewFileActions';
import EventActions from 'actions/reflux/EventActions';
import SystemActions from 'actions/reflux/SystemActions';

import { AccessEnum } from 'types/api';

const fetchStoreData = () => {
  const { hasAccess } = LoginStore;
  if (hasAccess(AccessEnum.PRIVATE_CHAT_VIEW)) {
    PrivateChatActions.fetchSessions();
  }

  if (hasAccess(AccessEnum.HUBS_VIEW)) {
    HubActions.fetchSessions();
  }

  if (hasAccess(AccessEnum.FILELISTS_VIEW)) {
    FilelistSessionActions.fetchSessions();
  }

  if (hasAccess(AccessEnum.VIEW_FILE_VIEW)) {
    ViewFileActions.fetchSessions();
  }

  if (hasAccess(AccessEnum.EVENTS_VIEW)) {
    EventActions.fetchInfo();
  }

  SystemActions.fetchAway();
};

export const useStoreDataFetch = (login: LoginState) => {
  useEffect(() => {
    if (login.socketAuthenticated) {
      fetchStoreData();
    }
  }, [login.socketAuthenticated]);
};
