import { useEffect, useState } from 'react';
import { LoginAPIActions } from '@/actions/store/LoginActions';

import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useSocket } from '@/context/SocketContext';
import { useAppStoreApi, useAppStoreProperty } from '@/context/AppStoreContext';

export interface LoginLocationState {
  nextPath?: string;
}

const useSessionState = () => {
  const [loading, setLoading] = useState(false);
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const socket = useSocket();
  const appStoreApi = useAppStoreApi();

  const login = useAppStoreProperty((state) => state.login);

  const refreshToken = login.getRefreshToken();
  const session = login.getSession();

  const checkLoginState = () => {
    if (login.socketAuthenticated) {
      // Set UI language to match the app language
      const { system_info: systemInfo } = session!;
      if (systemInfo) {
        const language = systemInfo.language;
        if (language !== i18n.language) {
          i18n.changeLanguage(language);
        }
      }

      // Redirect to the main app
      const state = location.state as LoginLocationState;
      const nextPath = state?.nextPath ?? '/';
      navigate(nextPath, { replace: true });
    } else if (!!login.lastError && !refreshToken) {
      // Keep the loading state as true as long as there is socket actions happening
      // Changing the state to false will allow the login page to update

      // Failed
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLoginState();
  }, [login]);

  useEffect(() => {
    if (!!refreshToken) {
      LoginAPIActions.loginRefreshToken(refreshToken, {
        socket,
        appStore: appStoreApi.getState(),
      });
      setLoading(true);
    }
  }, []);

  return { loading, setLoading };
};

export { useSessionState };
