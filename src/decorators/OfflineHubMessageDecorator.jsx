import React from 'react';
import Reflux from 'reflux';

import HubSessionStore from 'stores/HubSessionStore';
import Message from 'components/semantic/Message';

// Disables the component of there are no online hubs
const OfflineHubMessageDecorator = React.createClass({
	mixins: [ Reflux.ListenerMixin ],
	propTypes: {

		/**
		 * Function to call when pressing enter
		 */
		offlineMessage: React.PropTypes.any.isRequired
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
		if (!this.state.hasConnectedHubs) {
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