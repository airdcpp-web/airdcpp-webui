import * as React from 'react';

import LoginStore, {
  LoginError,
  LoginState,
  TranslatableLoginError,
} from 'stores/LoginStore';

import SocketConnectStatus from 'components/main/SocketConnectStatus';
import { useStore } from 'effects/StoreListenerEffect';
import { useSessionGuard } from '../effects/LoginGuardEffect';
import { useAuthPageTitle } from '../effects/PageTitleEffect';
import { useStoreDataFetch } from '../effects/StoreDataFetchEffect';
import { useTranslation } from 'react-i18next';
import { toI18nKey, translate } from 'utils/TranslationUtils';

import * as UI from 'types/ui';
import { useLocation } from 'react-router';

interface AuthenticationGuardDecoratorProps {}

const parseError = (error: TranslatableLoginError | string, t: UI.TranslateF) => {
  if (typeof error === 'string') {
    return error;
  }

  return t(toI18nKey(error.id, UI.Modules.LOGIN), error.message);
};

const getConnectStatusMessage = (lastError: LoginError, t: UI.TranslateF) => {
  if (!!lastError) {
    const msg = t(
      toI18nKey('reestablishConnection', UI.Modules.LOGIN),
      'Attempting to re-establish connection...',
    );

    return `${parseError(lastError, t)}. ${msg}`;
  }

  return translate('Connecting to the server...', t, UI.Modules.LOGIN);
};

function AuthenticationGuardDecorator<PropsT>(Component: React.ComponentType<PropsT>) {
  const Decorator: React.FC<PropsT & AuthenticationGuardDecoratorProps> = (props) => {
    const login = useStore<LoginState>(LoginStore);
    const location = useLocation();
    useSessionGuard(login, location);
    useAuthPageTitle(login);
    useStoreDataFetch(login);
    const { t } = useTranslation();

    if (!login.socketAuthenticated) {
      // Dim the screen until the server can be reached (we can't do anything without the socket)
      return (
        <SocketConnectStatus message={getConnectStatusMessage(login.lastError, t)} />
      );
    }

    return <Component {...props} />;
  };

  return Decorator;
}

export default AuthenticationGuardDecorator;
