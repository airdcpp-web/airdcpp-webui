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


const EventMessages = React.createClass({
	render: function () {
		const { messages } = this.props;
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

		const messageList = messages.map(message => {
			return {
				log_message: message,
			};
		});

		return (
			<MessageView 
				className="events"
				messages={ messageList }
			/>
		);
	}
});

const SystemLog = React.createClass({
	mixins: [ LocationContext, Reflux.connect(EventStore, 'messages'), ],
	componentWillMount: function () {
		EventActions.setActive(true);
		EventActions.setRead();

		if (!this.state.messages) {
			EventActions.fetchMessages();
		}
	},

	componentWillUnmount() {
		EventActions.setActive(false);
	},

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.messages !== this.state.messages;
	},

	_handleClear() {
		EventActions.clear();
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
