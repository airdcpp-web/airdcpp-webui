import LoginStore, { LoginState } from 'stores/LoginStore';
import { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import LoginActions from 'actions/reflux/LoginActions';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { useTranslation } from 'react-i18next';


export interface LoginLocationState {
  nextPath?: string;
}

const useLoginState = (props: RouteComponentProps<UI.EmptyObject, any, LoginLocationState>) => {
  const loadingState = useState(false);
  const setLoading = loadingState[1];
  const { i18n } = useTranslation();

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
      const { state } = props.location;
      const nextPath = state && state.nextPath ? state.nextPath : '/';
      props.history.replace({
        pathname: nextPath,
      });
    } else if (!!loginInfo.lastError && !LoginStore.refreshToken) {
      // Keep the loading state as true as long as there is socket actions happening
      // Changing the state to false will allow the login page to update

      // Failed
      setLoading(false);
    }
  };

  useEffect(
    () => {
      checkLoginState(LoginStore.getState());
      return LoginStore.listen(checkLoginState);
    },
    []
  );

  useEffect(
    () => {
      const refreshToken: string | null = LoginStore.refreshToken;
      if (!!refreshToken) {
        LoginActions.loginRefreshToken(refreshToken);
        setLoading(true);
      }
    },
    []
  );

  return loadingState;
};

export { useLoginState };
