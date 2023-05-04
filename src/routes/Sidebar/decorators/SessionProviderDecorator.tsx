import * as React from 'react';

import Loader from 'components/semantic/Loader';
import { useStore } from 'effects/StoreListenerEffect';

import * as UI from 'types/ui';

import { useTranslation } from 'react-i18next';
import { getModuleT, translate } from 'utils/TranslationUtils';
import { useParams } from 'react-router-dom';

export interface SessionProviderDecoratorProps {}

export interface SessionProviderDecoratorChildProps<SessionT extends UI.SessionType> {
  items: SessionT[];
  sessionT: UI.ModuleTranslator;
  params: UI.RouteParams;
}

const SessionProviderDecorator = <SessionT extends UI.SessionType>(
  Component: React.ComponentType<SessionProviderDecoratorChildProps<SessionT>>,
  store: UI.SessionStore<SessionT>,
  moduleId: UI.Modules
) => {
  const Decorator = (props: SessionProviderDecoratorProps) => {
    const { t } = useTranslation();
    const sessionT = getModuleT(t, moduleId);
    const params = useParams();
    const sessions = useStore<SessionT[]>(store);
    if (!store.isInitialized()) {
      return <Loader text={translate('Loading sessions', t, UI.Modules.COMMON)} />;
    }

    return <Component items={sessions} params={params} sessionT={sessionT} />;
  };

  return Decorator;
};

export { SessionProviderDecorator };
