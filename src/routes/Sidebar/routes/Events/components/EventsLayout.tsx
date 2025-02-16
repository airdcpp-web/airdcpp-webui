import { useEffect, memo } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { EventActionMenu } from 'actions/ui/event/EventActions';

import LayoutHeader from 'components/semantic/LayoutHeader';

import EventMessageView from 'routes/Sidebar/routes/Events/components/EventMessageView';

import * as UI from 'types/ui';

import { translate } from 'utils/TranslationUtils';
import IconConstants from 'constants/IconConstants';
import { ActionMenu } from 'components/action-menu';
import { useAppStore, useStoreProperty } from 'context/StoreContext';
import { EventAPIActions } from 'actions/store/EventActions';

import '../style.css';

const SystemLog: React.FC = memo(
  function SystemLog() {
    const store = useAppStore();
    const setViewActive = useStoreProperty((state) => state.events.setViewActive);

    useEffect(() => {
      setViewActive(true);
      EventAPIActions.setRead();

      if (!store.events.isInitialized()) {
        EventAPIActions.fetchMessages(store);
      }

      return () => setViewActive(false);
    }, []);

    const { t } = useTranslation();
    const messages = useStoreProperty((state) => state.events.logMessages);
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

export default SystemLog;
