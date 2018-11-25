import React, { useEffect, memo } from 'react';

import EventActions from 'actions/EventActions';
import EventStore from 'stores/EventStore';

import LayoutHeader from 'components/semantic/LayoutHeader';
import ActionButton from 'components/ActionButton';

import '../style.css';
import EventMessageView from 'routes/Sidebar/routes/Events/components/EventMessageView';

import * as UI from 'types/ui';
import { useStore } from 'effects/StoreListenerEffect';


interface SystemLogProps {

}

const SystemLog: React.FC<SystemLogProps> = memo(
  () => {
    useEffect(
      () => {
        EventActions.setActive(true);
        EventActions.setRead();
    
        if (!EventStore.isInitialized()) {
          EventActions.fetchMessages();
        }

        return () => EventActions.setActive(false);
      },
      []
    );

    const messages = useStore<UI.MessageListItem[]>(EventStore);
    return (
      <div className="simple-layout">
        <div className="wrapper">
          <LayoutHeader
            icon="blue history"
            title="Events"
            rightComponent={
              <ActionButton 
                action={ EventActions.clear }
              />
            }
          />
          <div className="ui divider top"/>
          <div className="layout-content system-log">
            <EventMessageView messages={ messages }/>
          </div>
        </div>
      </div>
    );
  }, 
  () => false
);

export default SystemLog;
