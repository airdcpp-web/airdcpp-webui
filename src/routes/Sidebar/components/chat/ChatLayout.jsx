'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import ScrollDecorator from 'decorators/ScrollDecorator';
import { ChatMessage, StatusMessage } from './Message';
import MessageComposer from './MessageComposer';

import './messages.css';


const MessageSection = ScrollDecorator(React.createClass({
	getMessageListItem(message) {
		if (message.chat_message) {
			return (
				<ChatMessage
					key={message.chat_message.id}
					message={message.chat_message}
					location={this.props.location}
					dropdownContextGetter={ () => ReactDOM.findDOMNode(this) }
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
		handleSend: React.PropTypes.func.isRequired
	},

	render() {
		return (
			<div className="message-view">
				<MessageSection messages={this.props.messages} location={this.props.location}/>
				<MessageComposer handleSend={this.props.handleSend}/>
			</div>
		);
	},
});

export default MessageView;
