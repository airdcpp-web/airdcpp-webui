'use strict';

import React from 'react';

import ScrollDecorator from 'decorators/ScrollDecorator';
import { ChatMessage, StatusMessage } from './Message';
import MessageComposer from './MessageComposer';

import LoginStore from 'stores/LoginStore';

import './messages.css';


const MessageSection = ScrollDecorator(React.createClass({
	getMessageListItem(message) {
		if (message.chat_message) {
			return (
				<ChatMessage
					key={message.chat_message.id}
					message={message.chat_message}
					location={this.props.location}
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
		return nextProps.messages !== this.props.messages;
	},

	render: function () {
		return (
			<div className="message-section">
				<div className="ui list message-list">
					{this.props.messages.map(this.getMessageListItem)}
				</div>
			</div>
		);
	},
}));

const MessageView = React.createClass({
	propTypes: {

		/**
		 * List of messages
		 */
		messages: React.PropTypes.array.isRequired,

		/**
		 * Handles sending of the message. Receives the text as param.
		 */
		handleSend: React.PropTypes.func.isRequired,

		/**
		 * Access required for sending messages
		 */
		chatAccess: React.PropTypes.string.isRequired,
	},

	render() {
		const { chatAccess, messages, location, handleSend } = this.props;
		return (
			<div className="message-view">
				<MessageSection messages={messages} location={location}/>
				{ LoginStore.hasAccess(chatAccess) ? <MessageComposer handleSend={handleSend}/> : null }
			</div>
		);
	},
});

export default MessageView;
