import React from 'react';
import Reflux from 'reflux';

import HubSessionStore from 'stores/HubSessionStore'

// Disables the component of there are no online hubs
const OfflineHubMessageDecorator = React.createClass({
	mixins: [Reflux.ListenerMixin],
	displayName: "OfflineHubMessageDecorator",
	propTypes: {

		/**
		 * Function to call when pressing enter
		 */
		offlineMessage: React.PropTypes.any.isRequired
	},

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
				<div className="offline-message">
  				<div className="ui icon message">
  					<i className="plug icon"></i>
  					<div className="content">
  						<div className="header">
  							No online hubs
  						</div>
  						<p>{this.props.offlineMessage}</p>
  					</div>
  				</div>
				</div>)
		}

		return this.props.children
	},
});

export default OfflineHubMessageDecorator