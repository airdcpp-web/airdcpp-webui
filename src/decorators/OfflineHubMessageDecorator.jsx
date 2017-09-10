import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import Reflux from 'reflux';

import HubSessionStore from 'stores/HubSessionStore';
import Message from 'components/semantic/Message';

import LoginStore from 'stores/LoginStore';
import AccessConstants from 'constants/AccessConstants';


// Disables the component if there are no online hubs
const OfflineHubMessageDecorator = createReactClass({
  displayName: 'OfflineHubMessageDecorator',
  mixins: [ Reflux.ListenerMixin ],

  propTypes: {

    /**
		 * Function to call when pressing enter
		 */
    offlineMessage: PropTypes.any.isRequired
  },

  componentDidMount: function () {
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
    if (!this.state.hasConnectedHubs && LoginStore.hasAccess(AccessConstants.HUBS_VIEW)) {
      return (
        <Message 
          className="offline-message" 
          icon="plug" 
          title="No online hubs" 
          description={this.props.offlineMessage}
        />
      );
    }

    return this.props.children;
  },
});

export default OfflineHubMessageDecorator
;