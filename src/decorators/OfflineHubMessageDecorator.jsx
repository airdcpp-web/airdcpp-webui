import React from 'react';
import Reflux from 'reflux';

import HubSessionStore from 'stores/HubSessionStore'

// Disables the component of there are no online hubs
export default function(Component, message) {
  const OfflineHubMessageDecorator = React.createClass({
    mixins: [Reflux.ListenerMixin],
    displayName: "OfflineHubMessageDecorator",
    componentDidMount: function() {
      this.listenTo(HubSessionStore, this.updateState);
    },

    getInitialState() {
      return {
        hasConnectedHubs: HubSessionStore.hasConnectedHubs()
      }
    },

    updateState() {
      this.setState({ hasConnectedHubs: HubSessionStore.hasConnectedHubs() });
    },

    render() {
      if (!this.state.hasConnectedHubs) {
        return (
          <div>
          <div className="ui icon message">
            <i className="plug icon"></i>
            <div className="content">
              <div className="header">
                No online hubs
              </div>
              <p>{message}</p>
            </div>
          </div>
          </div>)
      }

      return <Component {...this.props}/>
    },
  });

  return OfflineHubMessageDecorator;
}