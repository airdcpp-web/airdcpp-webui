import * as React from 'react';

import Loader from 'components/semantic/Loader';
import { useStore } from 'effects/StoreListenerEffect';

import * as UI from 'types/ui';

import { useTranslation } from 'react-i18next';
import { translate } from 'utils/TranslationUtils';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export interface SessionProviderDecoratorProps {}

export interface SessionProviderDecoratorChildProps<SessionT extends UI.SessionType>
  extends UI.RouteComponentProps {
  items: SessionT[];
  t: UI.TranslateF;
  params: UI.RouteParams;
}

const SessionProviderDecorator = <SessionT extends UI.SessionType, PropsT extends object>(
  Component: React.ComponentType<PropsT & SessionProviderDecoratorChildProps<SessionT>>,
  store: UI.SessionStore<SessionT>
) => {
  const Decorator = (props: SessionProviderDecoratorProps & PropsT) => {
    const { t } = useTranslation();
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const sessions = useStore<SessionT[]>(store);
    if (!store.isInitialized()) {
      return <Loader text={translate('Loading sessions', t, UI.Modules.COMMON)} />;
    }

    return (
      <Component
        items={sessions}
        t={t}
        params={params}
        location={location}
        navigate={navigate}
        {...props}
      />
    );
  };

  return Decorator;
};

export { SessionProviderDecorator };
