import React from 'react';

import Loader from 'components/semantic/Loader';
import { useStore } from 'effects/StoreListenerEffect';

import * as UI from 'types/ui';

import { useTranslation } from 'react-i18next';
import { translate } from 'utils/TranslationUtils';
import { TFunction } from 'i18next';


export type SessionProviderDecoratorProps = UI.SessionRouteProps;

export interface SessionProviderDecoratorChildProps<SessionT extends object> extends UI.SessionRouteProps {
  items: SessionT[];
  t: TFunction;
}

const SessionProviderDecorator = <SessionT extends object, PropsT extends object>(
  Component: React.ComponentType<PropsT & SessionProviderDecoratorChildProps<SessionT>>,
  store: any
) => {
  const Decorator = (props: SessionProviderDecoratorProps & PropsT) => {
    const { t } = useTranslation();
    const sessions = useStore<SessionT[]>(store);
    if (!store.isInitialized()) {
      return <Loader text={ translate('Loading sessions', t, UI.Modules.COMMON) }/>;
    }

    return (
      <Component 
        items={ sessions }
        t={ t }
        { ...props }
      />
    );
  };

  return Decorator;
};

export { SessionProviderDecorator };
