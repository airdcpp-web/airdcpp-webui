import React, { useEffect, memo } from 'react';

import EventAPIActions from 'actions/reflux/EventActions';
import EventUIActions from 'actions/ui/EventActions';

import EventStore from 'stores/EventStore';

import LayoutHeader from 'components/semantic/LayoutHeader';
import ActionButton from 'components/ActionButton';

import '../style.css';
import EventMessageView from 'routes/Sidebar/routes/Events/components/EventMessageView';

import * as UI from 'types/ui';

import { useStore } from 'effects/StoreListenerEffect';
import { useTranslation } from 'react-i18next';
import { translate } from 'utils/TranslationUtils';


interface SystemLogProps {

}

const SystemLog: React.FC<SystemLogProps> = memo(
  () => {
    useEffect(
      () => {
        EventAPIActions.setActive(true);
        EventAPIActions.setRead();
    
        if (!EventStore.isInitialized()) {
          EventAPIActions.fetchMessages();
        }

        return () => EventAPIActions.setActive(false);
      },
      []
    );

    const { t } = useTranslation();
    const messages = useStore<UI.MessageListItem[]>(EventStore);
    return (
      <div className="simple-layout">
        <div className="wrapper">
          <LayoutHeader
            icon="blue history"
            title={ translate('Events', t, UI.Modules.EVENTS) }
            rightComponent={
              <ActionButton 
                actions={ EventUIActions }
                actionId="clear"
                icon={ null }
              />
            }
          />
          <div className="ui divider top"/>
          <div className="layout-content system-log">
            <EventMessageView 
              messages={ messages }
              t={ t }
            />
          </div>
        </div>
      </div>
    );
  }, 
  () => true
);

export default SystemLog;
