import { useEffect, useState } from 'react';
import History from 'utils/History';

import LoginActions from 'actions/reflux/LoginActions';
import LoginStore, { LoginState } from 'stores/LoginStore';

import { Location } from 'history';


export const useLoginGuard = (login: LoginState, location: Location) => {
  const [ prevSocketAuthenticated, setPrevSocketAuthenticated ] = useState(LoginStore.getState().socketAuthenticated);

  useEffect(
    () => {
      if (login.hasSession && !login.socketAuthenticated) {
        LoginActions.connect(LoginStore.authToken);
      } else if (!login.hasSession) {
        // Go to the login page as we don't have a valid session
        // Return to this page if the session was lost (instead of having been logged out) 

        console.log('UI: Redirecting to login page');
        History.replace({
          state: prevSocketAuthenticated ? null : { nextPath: location.pathname }, // No redirect path when logging out
          pathname: '/login',
        });
      }

      setPrevSocketAuthenticated(login.socketAuthenticated);
    },
    [ login.socketAuthenticated, login.hasSession ]
  );
};
