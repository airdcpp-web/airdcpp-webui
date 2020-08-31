//import PropTypes from 'prop-types';
import React, { useEffect, useState, useContext } from 'react';

import HubConstants from 'constants/HubConstants';
import SocketService from 'services/SocketService';
import HubSessionStore from 'stores/HubSessionStore';

import { formatSize } from 'utils/ValueFormat';
import { SessionFooter, FooterItem } from 'routes/Sidebar/components/SessionFooter';
import EncryptionState from 'components/EncryptionState';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { ErrorResponse } from 'airdcpp-apisocket';
import { 
  SocketSubscriptionDecorator, SocketSubscriptionDecoratorChildProps
} from 'decorators/SocketSubscriptionDecorator';
import { useMobileLayout } from 'utils/BrowserUtils';
import { LayoutWidthContext } from 'context/LayoutWidthContext';


interface HubFooterProps {
  session: API.Hub;
  userlistToggle: React.ReactNode;
  sessionT: UI.ModuleTranslator;
}


type DataProps = SocketSubscriptionDecoratorChildProps<HubFooterProps>;
const HubFooter: React.FC<HubFooterProps & DataProps> = (props) => {
  const [ counts, setCounts ] = useState<API.HubCounts>({
    share_size: 0,
    user_count: 0
  });

  useEffect(
    () => {
      // Fetch initial
      SocketService.get<API.HubCounts>(`${HubConstants.SESSIONS_URL}/${props.session.id}/counts`)
        .then(setCounts)
        .catch((error: ErrorResponse) => console.error('Failed to fetch hub counts', error.message));

      // Subscription
      const url = HubConstants.SESSIONS_URL;
      props.addSocketListener(
        url, 
        HubConstants.SESSION_COUNTS_UPDATED, 
        (data: API.HubCounts) => setCounts(data), 
        props.session.id
      );

      return () => props.removeSocketListeners(props);
    },
    [ props.session ]
  );

  const layoutWidth = useContext(LayoutWidthContext);

  const { userlistToggle, session, sessionT } = props;
  const { user_count: users, share_size: shared } = counts;

  const averageShare = formatSize(users > 0 ? (shared / users) : 0, sessionT.plainT);
  return (
    <SessionFooter>
      <FooterItem 
        text={(
          <>
            <EncryptionState encryption={ session.encryption }/>
            { sessionT.t('xUsers', {
                defaultValue: '{{count}} user',
                defaultValue_plural: '{{count}} users',
                count: users,
                replace: {
                  count: users
                }
              }
            ) }
          </>
        )}
      />
      { !useMobileLayout(layoutWidth) && (
        <FooterItem 
          text={ sessionT.t('sharePerUser', {
            defaultValue: '{{total}} ({{average}}/user)',
            replace: {
              total: formatSize(shared, sessionT.plainT),
              average: averageShare
            }
          }) }
        /> 
      ) }
      <div className="userlist-button">
        { userlistToggle }
      </div>
    </SessionFooter>
  );
};

export default SocketSubscriptionDecorator(
  HubFooter,
  ({ session }) => !!HubSessionStore.getSession(session.id)
);