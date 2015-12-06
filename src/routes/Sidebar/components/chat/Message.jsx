'use strict';

import React from 'react';
import ValueFormat from 'utils/ValueFormat';

import ReactEmoji from 'react-emoji';
import Linkify from 'react-linkify';

import { UserMenu } from 'components/Menu';


const Author = ({ message, dropdownContextGetter, location }) => (
	<div className="header message-author-name">
		<UserMenu 
			location={location} 
			contextGetter={ dropdownContextGetter } 
			triggerIcon={null} 
			noIcon={true} 
			user={ message.from }
		/>
	</div>
);

Author.propTypes = {
	message: React.PropTypes.object.isRequired,
	location: React.PropTypes.object.isRequired,
	dropdownContextGetter: React.PropTypes.func.isRequired,
};

const TimeStamp = ({ message }) => (
	<div className="message-time">
		{ ValueFormat.formatTimestamp(message.time) }
	</div>
);

const MessageText = ({ message, emojify }) => (
	<div className="message-text">
		<Linkify properties={{ target: '_blank' }}>
			{ !emojify ? message.text : ReactEmoji.emojify(message.text, {
				emojiType: 'twemoji'
			})}
		</Linkify>
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
	<div className="ui item message-list-item status-message">
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
