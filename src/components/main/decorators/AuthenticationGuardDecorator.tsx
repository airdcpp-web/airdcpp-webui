import * as React from 'react';

import SocketConnectStatus from '@/components/main/SocketConnectStatus';
import { useSessionGuard } from '../effects/LoginGuardEffect';
import { useAuthPageTitle } from '../effects/PageTitleEffect';
import { toI18nKey, translate } from '@/utils/TranslationUtils';

import * as UI from '@/types/ui';

import { parseLoginError } from '@/utils/AuthUtils';
import { SessionStoreProvider } from '@/context/SessionStoreContext';
import { useSocket } from '@/context/SocketContext';

import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAppStoreProperty } from '@/context/AppStoreContext';

interface AuthenticationGuardDecoratorProps {}

const getConnectStatusMessage = (lastError: UI.LoginError, t: UI.TranslateF) => {
  if (!!lastError) {
    const msg = t(
      toI18nKey('reestablishConnection', UI.Modules.LOGIN),
      'Attempting to re-establish connection...',
    );

    return `${parseLoginError(lastError, t)}. ${msg}`;
  }

  return translate('Connecting to the server...', t, UI.Modules.LOGIN);
};

function AuthenticationGuardDecorator<PropsT>(Component: React.ComponentType<PropsT>) {
  const Decorator: React.FC<PropsT & AuthenticationGuardDecoratorProps> = (props) => {
    const socket = useSocket();
    const login = useAppStoreProperty((state) => state.login);
    const location = useLocation();

    useSessionGuard(login, location);
    useAuthPageTitle(login);

    const { t } = useTranslation();

    if (!login.socketAuthenticated) {
      // Dim the screen until the server can be reached (we can't do anything without the socket)
      return (
        <SocketConnectStatus message={getConnectStatusMessage(login.lastError, t)} />
      );
    }

    return (
      <SessionStoreProvider socket={socket} login={login.getSession()!}>
        <Component login={login} {...props} />
      </SessionStoreProvider>
    );
  };

  return Decorator;
}

export default AuthenticationGuardDecorator;
