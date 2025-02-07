import { memo } from 'react';
import * as React from 'react';

import HubSessionStore from 'stores/reflux/HubSessionStore';
import Message, { MessageDescriptionType } from 'components/semantic/Message';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { Trans } from 'react-i18next';
import { toI18nKey } from 'utils/TranslationUtils';
import IconConstants from 'constants/IconConstants';
import { useStore } from 'effects/StoreListenerEffect';
import { useSession } from 'context/SessionContext';

export type OfflineHubMessageDecoratorProps = React.PropsWithChildren<{
  offlineMessage: MessageDescriptionType;
}>;

// Disables the component if there are no online hubs
const OfflineHubMessageDecorator: React.FC<OfflineHubMessageDecoratorProps> = memo(
  function OfflineHubMessageDecorator(props) {
    const hasConnectedHubs = useStore<boolean>(HubSessionStore, (store) =>
      store.hasConnectedHubs(),
    );
    const { hasAccess } = useSession();
    if (!hasConnectedHubs && hasAccess(API.AccessEnum.HUBS_VIEW)) {
      return (
        <Message
          className="offline-message"
          icon={IconConstants.OFFLINE}
          title={
            <Trans i18nKey={toI18nKey('noOnlineHubs', UI.Modules.COMMON)}>
              No online hubs
            </Trans>
          }
          description={props.offlineMessage}
        />
      );
    }

    return <>{props.children}</>;
  },
);

export default OfflineHubMessageDecorator;
