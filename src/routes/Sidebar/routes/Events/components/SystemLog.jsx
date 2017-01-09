import React from 'react';
import Reflux from 'reflux';
import { LocationContext } from 'mixins/RouterMixin';

import EventActions from 'actions/EventActions';
import EventStore from 'stores/EventStore';

import LayoutHeader from 'components/semantic/LayoutHeader';
import ActionButton from 'components/ActionButton';
import Loader from 'components/semantic/Loader';

import Message from 'components/semantic/Message';
import MessageView from 'components/messages/MessageView';

import '../style.css';


const mapViewMessage = message => {
	return {
		log_message: message,
	};
};

const EventMessages = ({ messages }) => {
	if (!messages) {
		return <Loader text="Loading messages"/>;
	}

	if (messages.length === 0) {
		return (
			<Message 
				description="No messages to show"
			/>
		);
	}

	return (
		<MessageView 
			className="events"
			messages={ messages.map(mapViewMessage) }
		/>
	);
};

const SystemLog = React.createClass({
	mixins: [ LocationContext, Reflux.connect(EventStore, 'messages'), ],
	componentWillMount() {
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

	render: function () {
		return (
			<div className="simple-layout">
				<div className="wrapper">
					<LayoutHeader
						icon="blue history"
						title="Events"
						component={
							<ActionButton 
								action={ EventActions.clear }
							/>
						}
					/>
					<div className="ui divider top"/>
					<div className="layout-content system-log">
						<EventMessages messages={ this.state.messages }/>
					</div>
				</div>
			</div>
		);
	}
});

export default SystemLog;
