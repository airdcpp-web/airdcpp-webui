import { useEffect, memo } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { EventActionMenu } from '@/actions/ui/event/EventActions';

import LayoutHeader from '@/components/semantic/LayoutHeader';

import EventMessageView from '@/routes/Sidebar/routes/Events/components/EventMessageView';

import * as UI from '@/types/ui';

import { translate } from '@/utils/TranslationUtils';
import IconConstants from '@/constants/IconConstants';
import { ActionMenu } from '@/components/action-menu';
import { useSessionStore, useSessionStoreProperty } from '@/context/SessionStoreContext';
import { EventAPIActions } from '@/actions/store/EventActions';

import '../style.css';

import { useSocket } from '@/context/SocketContext';

const Events: React.FC = memo(
  function SystemLog() {
    const sessionStore = useSessionStore();
    const setViewActive = useSessionStoreProperty((state) => state.events.setViewActive);
    const socket = useSocket();

    useEffect(() => {
      setViewActive(true);
      EventAPIActions.setRead(socket);

      if (!sessionStore.events.isInitialized) {
        EventAPIActions.fetchMessages(sessionStore, socket);
      }

      return () => setViewActive(false);
    }, []);

    const { t } = useTranslation();
    const messages = useSessionStoreProperty((state) => state.events.logMessages);
    return (
      <div className="simple-layout">
        <div className="wrapper">
          <LayoutHeader
            icon={IconConstants.EVENTS_COLORED}
            title={
              <ActionMenu
                caption={translate('Events', t, UI.Modules.EVENTS)}
                actions={EventActionMenu}
                remoteMenuId="events"
              />
            }
          />
          <div className="ui divider top" />
          <div className="layout-content system-log">
            <EventMessageView messages={messages} t={t} />
          </div>
        </div>
      </div>
    );
  },
  () => true,
);

export default Events;
