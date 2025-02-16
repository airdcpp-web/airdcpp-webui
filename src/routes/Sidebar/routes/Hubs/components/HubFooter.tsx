import { useEffect, useState } from 'react';
import { ErrorResponse } from 'airdcpp-apisocket';

import HubConstants from 'constants/HubConstants';

import { useFormatter } from 'context/FormatterContext';
import { SessionFooter, FooterItem } from 'routes/Sidebar/components/SessionFooter';
import EncryptionState from 'components/EncryptionState';

import * as API from 'types/api';
import * as UI from 'types/ui';

import {
  SocketSubscriptionDecorator,
  SocketSubscriptionDecoratorChildProps,
} from 'decorators/SocketSubscriptionDecorator';
import { usingMobileLayout } from 'utils/BrowserUtils';
import { useLayoutWidth } from 'context/LayoutWidthContext';
import { ActionMenu } from 'components/action-menu';
import { HubSettingActionMenu } from 'actions/ui/hub/HubSettingActions';
import { useSocket } from 'context/SocketContext';

interface HubFooterProps {
  session: API.Hub;
  userlistToggle: React.ReactNode;
  sessionT: UI.ModuleTranslator;
}

type DataProps = SocketSubscriptionDecoratorChildProps<HubFooterProps>;
const HubFooter: React.FC<HubFooterProps & DataProps> = (props) => {
  const { formatSize } = useFormatter();
  const socket = useSocket();
  const [counts, setCounts] = useState<API.HubCounts>({
    share_size: 0,
    user_count: 0,
  });

  useEffect(() => {
    // Fetch initial
    socket
      .get<API.HubCounts>(`${HubConstants.SESSIONS_URL}/${props.session.id}/counts`)
      .then(setCounts)
      .catch((error: ErrorResponse) =>
        console.error('Failed to fetch hub counts', error.message),
      );

    // Subscription
    const url = HubConstants.SESSIONS_URL;
    props.addSocketListener(
      url,
      HubConstants.SESSION_COUNTS_UPDATED,
      (data: API.HubCounts) => setCounts(data),
      props.session.id,
    );

    return () => props.removeSocketListeners(props);
  }, [props.session]);

  const layoutWidth = useLayoutWidth();

  const { userlistToggle, session, sessionT } = props;
  const { user_count: users, share_size: shared } = counts;

  const averageShare = formatSize(users > 0 ? shared / users : 0);
  return (
    <SessionFooter>
      <FooterItem
        text={
          <>
            <EncryptionState encryption={session.encryption} />
            {sessionT.t('xUsers', {
              defaultValue: '{{count}} user',
              defaultValue_plural: '{{count}} users',
              count: users,
              replace: {
                count: users,
              },
            })}
          </>
        }
      />
      {!usingMobileLayout(layoutWidth) && (
        <FooterItem
          text={sessionT.t('sharePerUser', {
            defaultValue: '{{total}} ({{average}}/user)',
            replace: {
              total: formatSize(shared),
              average: averageShare,
            },
          })}
        />
      )}
      <div className="actions-wrapper">
        <div className="actions">
          {userlistToggle}
          <ActionMenu
            className="top left pointing"
            actions={HubSettingActionMenu}
            header={sessionT.translate('Notification settings')}
            itemData={session}
            triggerIcon={
              session.settings.use_main_chat_notify || session.settings.show_joins
                ? 'yellow bell'
                : 'bell'
            }
          />
        </div>
      </div>
    </SessionFooter>
  );
};

export default SocketSubscriptionDecorator(
  HubFooter,
  // ({ session }) => !!HubSessionStore.getSession(session.id),
);
