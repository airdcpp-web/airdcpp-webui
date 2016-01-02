'use strict';
import React from 'react';
import update from 'react-addons-update';

import ScrollDecorator from 'decorators/ScrollDecorator';
import { ChatMessage, StatusMessage } from './Message';


const MessageView = React.createClass({
	propTypes: {
		/**
		 * Currently active session
		 */
		session: React.PropTypes.any.isRequired,

		messageStore: React.PropTypes.object.isRequired,

		chatActions: React.PropTypes.object.isRequired,
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
			messages: []
		};
	},

	setSession(id) {
		const { chatActions } = this.props;
		chatActions.sessionChanged(id);
		if (!id) {
			return;
		}

		chatActions.setRead(id);

		const messages = this.props.messageStore.getMessages()[id];
		if (!messages) {
			if (this.state.messages.length > 0) {
				this.setState({ messages: [] });
			}
			
			chatActions.fetchMessages(id);
		} else {
			this.setState({ messages: messages });
		}
	},

	_onMessage(data) {
		const messages = update(this.state.messages, { $push: [ { chat_message: data } ] });
		this.setState({ messages: messages });
	},

	componentDidMount() {
		this.setSession(this.props.session.id);
	},

	componentWillUnmount() {
		this.unsubscribe();
		this.setSession(null);
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.session.id != nextProps.session.id) {
			this.setSession(nextProps.session.id);
		}
	},

	getMessageListItem(message) {
		if (message.chat_message) {
			return (
				<ChatMessage
					key={ message.chat_message.id }
					message={ message.chat_message }
					location={ this.props.location }
					dropdownContextGetter={ this.props.dropdownContextGetter }
				/>
			);
		}

		return (
			<StatusMessage
				key={message.log_message.id}
				message={message.log_message}
			/>
		);
	},

	shouldComponentUpdate: function (nextProps, nextState) {
		return nextState.messages !== this.state.messages || nextProps.session !== this.props.session;
	},

	render: function () {
		return (
			<div className="message-section">
				<div className="ui list message-list">
					{ this.state.messages.map(this.getMessageListItem) }
				</div>
			</div>
		);
	},
});

export default ScrollDecorator(MessageView);