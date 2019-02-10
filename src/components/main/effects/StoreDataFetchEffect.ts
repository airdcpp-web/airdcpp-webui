'use strict';
import { useEffect } from 'react';

import LoginStore, { LoginState } from 'stores/LoginStore';


import HubActions from 'actions/HubActions';
import PrivateChatActions from 'actions/PrivateChatActions';
import FilelistSessionActions from 'actions/FilelistSessionActions';
import ViewFileActions from 'actions/ViewFileActions';
import EventActions from 'actions/EventActions';
import SystemActions from 'actions/SystemActions';

import { AccessEnum } from 'types/api';


const fetchStoreData = () => {
  if (LoginStore.hasAccess(AccessEnum.PRIVATE_CHAT_VIEW)) {
    PrivateChatActions.actions.fetchSessions();
  }

  if (LoginStore.hasAccess(AccessEnum.HUBS_VIEW)) {
    HubActions.actions.fetchSessions();
  }

  if (LoginStore.hasAccess(AccessEnum.FILELISTS_VIEW)) {
    FilelistSessionActions.actions.fetchSessions();
  }

  if (LoginStore.hasAccess(AccessEnum.VIEW_FILE_VIEW)) {
    ViewFileActions.actions.fetchSessions();
  }

  if (LoginStore.hasAccess(AccessEnum.EVENTS_VIEW)) {
    EventActions.actions.fetchInfo();
  }

  SystemActions.actions.fetchAway();
};

export const useStoreDataFetch = (login: LoginState) => {
  useEffect(
    () => {
      if (login.socketAuthenticated) {
        fetchStoreData();
      }
    },
    [ login.socketAuthenticated ]
  );
};
