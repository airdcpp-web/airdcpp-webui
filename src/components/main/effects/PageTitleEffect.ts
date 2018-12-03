'use strict';
import { useEffect } from 'react';

import LoginStore, { LoginState } from 'stores/LoginStore';

import * as API from 'types/api';


const updateTitle = (systemInfo: API.SystemInfo | null) => {
  let title = 'AirDC++ Web Client';
  if (!!systemInfo) {
    title = systemInfo.hostname + ' - ' + title;
  }

  document.title = title;
};

export const usePageTitle = (login: LoginState) => {
  useEffect(
    () => {
      updateTitle(LoginStore.systemInfo);
      return () => updateTitle(null);
    },
    [ login.socketAuthenticated ]
  );
};
