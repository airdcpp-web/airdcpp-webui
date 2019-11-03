'use strict';
import React from 'react';
import { Location } from 'history';

import LoginStore, { LoginState } from 'stores/LoginStore';

import SocketConnectStatus from 'components/main/SocketConnectStatus';
import { useStore } from 'effects/StoreListenerEffect';
import { useLoginGuard } from '../effects/LoginGuardEffect';
import { usePageTitle } from '../effects/PageTitleEffect';
import { useStoreDataFetch } from '../effects/StoreDataFetchEffect';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { toI18nKey, translate } from 'utils/TranslationUtils';

import * as UI from 'types/ui';


interface AuthenticationGuardDecoratorProps {
  location: Location;
}



const getConnectStatusMessage = (lastError: string | null, t: TFunction) => {
  if (!!lastError) {
    const msg = t(toI18nKey('reestablishConnection', UI.Modules.LOGIN), 'Attempting to re-establish connection...');
    return `${lastError}. ${msg}`;
  }

  return translate('Connecting to the server...', t, UI.Modules.LOGIN);
};

function AuthenticationGuardDecorator<PropsT>(
  Component: React.ComponentType<PropsT>
) {
  const Decorator: React.FC<PropsT & AuthenticationGuardDecoratorProps> = props => {
    const login = useStore<LoginState>(LoginStore);
    useLoginGuard(login, props.location);
    usePageTitle(login);
    useStoreDataFetch(login);
    const { t } = useTranslation();

    if (!login.socketAuthenticated) {
      // Dim the screen until the server can be reached (we can't do anything without the socket)
      return (
        <SocketConnectStatus 
          message={ getConnectStatusMessage(login.lastError, t) }
        />
      );
    }

    return (
      <Component 
        { ...props }
      />
    );
  };

  return Decorator;
}

export default AuthenticationGuardDecorator;
