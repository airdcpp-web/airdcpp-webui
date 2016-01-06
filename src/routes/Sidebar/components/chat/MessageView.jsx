'use strict';
import React from 'react';

import Loader from 'components/semantic/Loader';
import ScrollDecorator from 'decorators/ScrollDecorator';
import { ChatMessage, StatusMessage } from './Message';


const MessageView = React.createClass({
	propTypes: {
		messages: React.PropTypes.array,
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
		return nextProps.messages !== this.props.messages;
	},

	render: function () {
		const { messages } = this.props;
		if (!messages) {
			return <Loader text="Loading messages"/>;
		}

		return (
			<div className="message-section">
				<div className="ui list message-list">
					{ messages.map(this.getMessageListItem) }
				</div>
			</div>
		);
	},
});

export default ScrollDecorator(MessageView);