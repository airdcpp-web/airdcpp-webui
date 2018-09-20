import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
//@ts-ignore
import Reflux from 'reflux';

import HubSessionStore from 'stores/HubSessionStore';
import Message, { MessageDescriptionType } from 'components/semantic/Message';

import LoginStore from 'stores/LoginStore';

import * as API from 'types/api';


interface OfflineHubMessageDecoratorProps {
  offlineMessage: MessageDescriptionType;
}

// Disables the component if there are no online hubs
const OfflineHubMessageDecorator = createReactClass<OfflineHubMessageDecoratorProps, {}>({
  displayName: 'OfflineHubMessageDecorator',
  mixins: [ Reflux.ListenerMixin ],

  propTypes: {
    // Function to call when pressing enter
    offlineMessage: PropTypes.any.isRequired
  },

  componentDidMount() {
    this.listenTo(HubSessionStore, this.updateState);
  },

  getInitialState() {
    return {
      hasConnectedHubs: HubSessionStore.hasConnectedHubs()
    };
  },

  updateState() {
    this.setState({ hasConnectedHubs: HubSessionStore.hasConnectedHubs() });
  },

  render() {
    if (!this.state.hasConnectedHubs && LoginStore.hasAccess(API.AccessEnum.HUBS_VIEW)) {
      return (
        <Message 
          className="offline-message" 
          icon="plug" 
          title="No online hubs" 
          description={ this.props.offlineMessage }
        />
      );
    }

    return this.props.children;
  },
});

export default OfflineHubMessageDecorator
;