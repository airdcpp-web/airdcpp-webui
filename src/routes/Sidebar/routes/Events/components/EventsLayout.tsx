import React from 'react';
import createReactClass from 'create-react-class';
//@ts-ignore
import Reflux from 'reflux';

import EventActions from 'actions/EventActions';
import EventStore from 'stores/EventStore';

import LayoutHeader from 'components/semantic/LayoutHeader';
import ActionButton from 'components/ActionButton';

import '../style.css';
import EventMessageView from 'routes/Sidebar/routes/Events/components/EventMessageView';


interface SystemLogProps {

}

interface State {
  messages: API.StatusMessage[];
}

const SystemLog = createReactClass<SystemLogProps, State>({
  displayName: 'SystemLog',
  mixins: [ Reflux.connect(EventStore, 'messages'), ],

  componentDidMount() {
    EventActions.setActive(true);
    EventActions.setRead();

    if (!EventStore.isInitialized()) {
      EventActions.fetchMessages();
    }
  },

  componentWillUnmount() {
    EventActions.setActive(false);
  },

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.messages !== this.state.messages;
  },

  render() {
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
            <EventMessageView messages={ this.state.messages }/>
          </div>
        </div>
      </div>
    );
  },
});

export default SystemLog;
