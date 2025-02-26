import { useEffect, useState } from 'react';

import LoginActions from '@/actions/reflux/LoginActions';
import LoginStore, { LoginState } from '@/stores/reflux/LoginStore';

import { useNavigate, Location } from 'react-router';
import { useSocket } from '@/context/SocketContext';

export const useSessionGuard = (login: LoginState, location: Location) => {
  const [prevSocketAuthenticated, setPrevSocketAuthenticated] = useState(
    LoginStore.getState().socketAuthenticated,
  );
  const socket = useSocket();

  const navigate = useNavigate();
  useEffect(() => {
    if (login.hasSession && !login.socketAuthenticated) {
      LoginActions.connect(LoginStore.authToken, socket);
    } else if (!login.hasSession) {
      // Go to the login page as we don't have a valid session
      // Return to this page if the session was lost (instead of having been logged out)

      console.log('UI: Redirecting to login page');
      navigate('/login', {
        state: prevSocketAuthenticated ? null : { nextPath: location.pathname }, // No redirect path when logging out
      });
    }

    setPrevSocketAuthenticated(login.socketAuthenticated);
  }, [login.socketAuthenticated, login.hasSession]);
};
