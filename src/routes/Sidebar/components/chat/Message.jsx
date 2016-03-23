'use strict';

import React from 'react';
import TextDecorator from 'components/TextDecorator';
import ValueFormat from 'utils/ValueFormat';

import { UserMenu } from 'components/menu/DropdownMenu';


const Author = ({ message, dropdownContextGetter }) => (
	<div className="header message-author-name">
		<UserMenu 
			contextGetter={ dropdownContextGetter } 
			triggerIcon={null} 
			noIcon={true} 
			user={ message.from }
		/>
	</div>
);

Author.propTypes = {
	message: React.PropTypes.object.isRequired,
	dropdownContextGetter: React.PropTypes.func.isRequired,
};

const TimeStamp = ({ message }) => (
	<div className="message-time">
		{ ValueFormat.formatTimestamp(message.time) }
	</div>
);

const MessageText = ({ message, emojify }) => (
	<div className="message-text">
		<TextDecorator
			emojify={ emojify }
			text={ message.text }
		/>
	</div>
);

MessageText.propTypes = {
	message: React.PropTypes.object.isRequired,
	emojify: React.PropTypes.bool.isRequired,
};


const ChatMessage = ({ message, ...other }) => (
		<div className={ 'ui item message-list-item chat-message ' + message.from.flags.join(' ')}>
			<Author 
				message={ message } 
				{ ...other }
			/>
			<TimeStamp 
				message={ message }
			/>

			<MessageText 
				message={ message }
				emojify={ message.from.flags.indexOf('bot') === -1 } // No emojis to bot messages as they are likely to contain false matches
			/>
		</div>
);

ChatMessage.propTypes = {
	message: React.PropTypes.object.isRequired,
};


const StatusMessage = ({ message }) => (
	<div className={ 'ui item message-list-item status-message ' + message.severity }>
		<TimeStamp message={ message }/>
		<MessageText 
			message={ message }
			emojify={ false }
		/>
	</div>
);

StatusMessage.propTypes = {
	message: React.PropTypes.object.isRequired,
};


export { ChatMessage, StatusMessage };
