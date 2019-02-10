import React, { useEffect, useState, memo } from 'react';

import HubSessionStore from 'stores/HubSessionStore';
import Message, { MessageDescriptionType } from 'components/semantic/Message';

import LoginStore from 'stores/LoginStore';

import * as API from 'types/api';
import { Trans } from 'react-i18next';


export interface OfflineHubMessageDecoratorProps {
  offlineMessage: MessageDescriptionType;
}

const useHasConnectedHubs = () => {
  const [ hasConnectedHubs, setHasConnectedHubs ] = useState(HubSessionStore.hasConnectedHubs());

  useEffect(
    () => {
      return HubSessionStore.listen(() => {
        setHasConnectedHubs(HubSessionStore.hasConnectedHubs());
      });
    },
    []
  );

  return hasConnectedHubs;
};

// Disables the component if there are no online hubs
const OfflineHubMessageDecorator: React.FC<OfflineHubMessageDecoratorProps> = memo(props => {
  const hasConnectedHubs = useHasConnectedHubs();
  if (!hasConnectedHubs && LoginStore.hasAccess(API.AccessEnum.HUBS_VIEW)) {
    return (
      <Message 
        className="offline-message" 
        icon="plug" 
        title={ (
          <Trans>
            No online hubs
          </Trans>
        ) }
        description={ props.offlineMessage }
      />
    );
  }

  return (
    <>
      { props.children }
    </>
  );
});

export default OfflineHubMessageDecorator;
