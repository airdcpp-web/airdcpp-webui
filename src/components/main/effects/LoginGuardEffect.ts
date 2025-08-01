import { useEffect, useState } from 'react';

import { LoginAPIActions } from '@/actions/store/LoginActions';

import { useNavigate, Location } from 'react-router';
import { useSocket } from '@/context/SocketContext';

import * as UI from '@/types/ui';
import { useAppStoreApi } from '@/context/AppStoreContext';

export const useSessionGuard = (login: UI.LoginState, location: Location) => {
  const [prevSocketAuthenticated, setPrevSocketAuthenticated] = useState(
    login.socketAuthenticated,
  );

  const socket = useSocket();
  const appStoreApi = useAppStoreApi();

  const navigate = useNavigate();
  const session = appStoreApi.getState().login.getSession();
  useEffect(() => {
    if (session && !login.socketAuthenticated) {
      LoginAPIActions.connect(session.auth_token, {
        appStore: appStoreApi.getState(),
        socket,
      });
    } else if (!session) {
      // Go to the login page as we don't have a valid session
      // Return to this page if the session was lost (instead of having been logged out)

      socket.logger.info('UI: Redirecting to login page');
      navigate('/login', {
        state: prevSocketAuthenticated ? null : { nextPath: location.pathname }, // No redirect path when logging out
      });
    }

    setPrevSocketAuthenticated(login.socketAuthenticated);
  }, [login.socketAuthenticated, session]);
};
