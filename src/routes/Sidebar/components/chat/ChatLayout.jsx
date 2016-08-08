'use strict';
import React from 'react';

import Message from 'components/semantic/Message';
import MessageComposer from './MessageComposer';
import MessageView from './MessageView';

import ActiveSessionDecorator from 'decorators/ActiveSessionDecorator';
import LoginStore from 'stores/LoginStore';

import './messages.css';


const ChatLayout = React.createClass({
	propTypes: {
		/**
		 * Access required for sending messages
		 */
		chatAccess: React.PropTypes.string.isRequired,

		session: React.PropTypes.any.isRequired,

		messageStore: React.PropTypes.object.isRequired,

		actions: React.PropTypes.object.isRequired,
	},

	onMessagesChanged(messages, id) {
		if (id != this.props.session.id) { // NOTE: this should allow type conversion
			return;
		}

		this.setState({ messages: messages });
	},

	getInitialState() {
		this.unsubscribe = this.props.messageStore.listen(this.onMessagesChanged);

		return {
			messages: null,
		};
	},

	onSessionActivated(id) {
		const messages = this.props.messageStore.getMessages()[id];
		if (!messages) {
			this.setState({ messages: null });

			this.props.actions.fetchMessages(id);
		} else {
			this.setState({ messages: messages });
		}
	},

	componentDidMount() {
		this.onSessionActivated(this.props.session.id);
	},

	componentWillUnmount() {
		this.unsubscribe();
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.session.id != nextProps.session.id) {
			this.onSessionActivated(nextProps.session.id);
		}
	},

	handleSend(message) {
		this.props.actions.sendMessage(this.props.session.id, message);
	},

	render() {
		const hasChatAccess = LoginStore.hasAccess(this.props.chatAccess);
		return (
			<div className="message-view">
				{ hasChatAccess ? null : <Message description="You aren't allowed to send new messages" idcon="blue info"/> }
				<MessageView 
					messages={ this.state.messages }
					session={ this.props.session }
				/>
				{ hasChatAccess ? (
					<MessageComposer 
						handleSend={ this.handleSend }
					/>
				) : null }
			</div>
		);
	},
});

export default ActiveSessionDecorator(ChatLayout);
