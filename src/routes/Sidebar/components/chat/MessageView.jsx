'use strict';
import React from 'react';

import Loader from 'components/semantic/Loader';
import ScrollDecorator from 'decorators/ScrollDecorator';
import { ChatMessage, StatusMessage } from './Message';
import ValueFormat from 'utils/ValueFormat';


const getMessageDay = (message) => {
	const time = message.chat_message ? message.chat_message.time : message.log_message.time;
	return new Date(time * 1000).getDate();
};

const isToday = (message) => {
	return getMessageDay(message) === new Date().getDate();
};


const MessageView = React.createClass({
	propTypes: {
		messages: React.PropTypes.array,
	},

	getMessageListItem(reduced, message, index, messageList) {
		// Push a divider when the date was changed
		if ((index === 0 && !isToday(message)) || (index > 0 && getMessageDay(messageList[index-1]) !== getMessageDay(message))) {
			reduced.push(
				<div className="ui horizontal divider">
					{ ValueFormat.formatCalendarTime(message.chat_message ? message.chat_message.time : message.log_message.time) }
				</div>
			);
		}

		// Push the message
		if (message.chat_message) {
			reduced.push(
				<ChatMessage
					key={ message.chat_message.id }
					message={ message.chat_message }
					dropdownContextGetter={ _ => '.chat.session' }
				/>
			);
		} else {
			reduced.push(
				<StatusMessage
					key={message.log_message.id}
					message={message.log_message}
				/>
			);
		}

		return reduced;
	},

	shouldComponentUpdate: function (nextProps, nextState) {
		return nextProps.messages !== this.props.messages;
	},

	render: function () {
		const { messages } = this.props;
		return (
			<div className="message-section">
				{ messages ? (
					<div className="ui list message-list">
						{ messages.reduce(this.getMessageListItem, []) }
					</div>
				) : (
					<Loader text="Loading messages"/>
				) }
			</div>
		);
	},
});

export default ScrollDecorator(MessageView);