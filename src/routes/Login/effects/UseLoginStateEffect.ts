import LoginStore, { LoginState } from 'stores/LoginStore';
import { useEffect, useState } from 'react';
import LoginActions from 'actions/reflux/LoginActions';

import * as API from 'types/api';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

export interface LoginLocationState {
  nextPath?: string;
}

const useSessionState = () => {
  const loadingState = useState(false);
  const setLoading = loadingState[1];
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const checkLoginState = (loginInfo: LoginState) => {
    if (loginInfo.socketAuthenticated) {
      // Set UI language to match the app language
      if (!!LoginStore.systemInfo) {
        const language = (LoginStore.systemInfo as API.SystemInfo).language;
        if (language !== i18n.language) {
          i18n.changeLanguage(language);
        }
      }

      // Redirect to the main app
      const state = location.state as LoginLocationState;
      const nextPath = state && state.nextPath ? state.nextPath : '/';
      navigate(nextPath, { replace: true });
    } else if (!!loginInfo.lastError && !LoginStore.refreshToken) {
      // Keep the loading state as true as long as there is socket actions happening
      // Changing the state to false will allow the login page to update

      // Failed
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLoginState(LoginStore.getState());
    return LoginStore.listen(checkLoginState);
  }, []);

  useEffect(() => {
    const refreshToken: string | null = LoginStore.refreshToken;
    if (!!refreshToken) {
      LoginActions.loginRefreshToken(refreshToken);
      setLoading(true);
    }
  }, []);

  return loadingState;
};

export { useSessionState };
