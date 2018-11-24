import React from 'react';

import Loader from 'components/semantic/Loader';
import { useStore } from 'effects/StoreListenerEffect';

import * as UI from 'types/ui';


export type SessionProviderDecoratorProps = UI.SessionRouteProps;

export interface SessionProviderDecoratorChildProps<SessionT extends object> extends UI.SessionRouteProps {
  items: SessionT[];
}

const SessionProviderDecorator = <SessionT extends object, PropsT extends object>(
  Component: React.ComponentType<PropsT & SessionProviderDecoratorChildProps<SessionT>>,
  store: any
) => {
  const Decorator = (props: SessionProviderDecoratorProps & PropsT) => {
    const sessions = useStore<SessionT[]>(store);
    if (!store.isInitialized()) {
      return <Loader text="Loading sessions"/>;
    }

    return (
      <Component 
        items={ sessions! }
        { ...props }
      />
    );
  };

  return Decorator;
};

export { SessionProviderDecorator };
