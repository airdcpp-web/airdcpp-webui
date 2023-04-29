import { useEffect, useState } from 'react';

import LoginActions from 'actions/reflux/LoginActions';
import LoginStore, { LoginState } from 'stores/LoginStore';

import { Location } from 'history';
import { useHistory } from 'react-router';

export const useLoginGuard = (login: LoginState, location: Location) => {
  const [prevSocketAuthenticated, setPrevSocketAuthenticated] = useState(
    LoginStore.getState().socketAuthenticated
  );

  const history = useHistory();
  useEffect(() => {
    if (login.hasSession && !login.socketAuthenticated) {
      LoginActions.connect(LoginStore.authToken);
    } else if (!login.hasSession) {
      // Go to the login page as we don't have a valid session
      // Return to this page if the session was lost (instead of having been logged out)

      console.log('UI: Redirecting to login page');
      history.replace({
        state: prevSocketAuthenticated ? null : { nextPath: location.pathname }, // No redirect path when logging out
        pathname: '/login',
      });
    }

    setPrevSocketAuthenticated(login.socketAuthenticated);
  }, [login.socketAuthenticated, login.hasSession]);
};
