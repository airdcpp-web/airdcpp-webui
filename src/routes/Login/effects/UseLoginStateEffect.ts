import LoginStore, { LoginState } from 'stores/LoginStore';
import { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import LoginActions from 'actions/LoginActions';


const useLoginState = (props: RouteComponentProps) => {
  const loadingState = useState(false);
  const setLoading = loadingState[1];

  useEffect(
    () => {
      return LoginStore.listen((loginInfo: LoginState) => {
        if (loginInfo.socketAuthenticated) {
          const { state } = props.location;
          const nextPath = state && state.nextPath ? state.nextPath : '/';
          props.history.replace({
            pathname: nextPath,
          });
        } else if (!!loginInfo.lastError) {
          setLoading(false);
        }
      });
    },
    []
  );

  useEffect(
    () => {
      const refreshToken: string | null = LoginStore.refreshToken;
      if (!!refreshToken) {
        LoginActions.actions.loginRefreshToken(refreshToken);
        setLoading(true);
      }
    },
    []
  );

  return loadingState;
};

export { useLoginState };
