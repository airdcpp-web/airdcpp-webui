'use strict';

import React from 'react';
import TextDecorator from 'components/TextDecorator';
import ValueFormat from 'utils/ValueFormat';

import { UserMenu } from 'components/menu/DropdownMenu';


const Author = ({ message, dropdownContextGetter }) => (
	<div className="header message-author-name">
		{ message.third_person ? (<span>*</span>) : null }
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


const ChatMessage = React.createClass({
	propTypes: {
		message: React.PropTypes.object.isRequired,
	},

	shouldComponentUpdate() {
		return false;
	},

	render() {
		const { message, ...other } = this.props;
		
		return (
			<div className={ 'ui item message-list-item chat-message ' + message.from.flags.join(' ')}>
				<TimeStamp 
					message={ message }
				/>
				<div className={ 'left ' + (message.third_person ? 'third-person' : 'normal') }>
					<Author 
						message={ message } 
						{ ...other }
					/>
					<MessageText 
						message={ message }
						emojify={ message.from.flags.indexOf('bot') === -1 } // No emojis to bot messages as they are likely to contain false matches
					/>
				</div>
			</div>
		);
	}
});


const StatusMessage = React.createClass({
	propTypes: {
		message: React.PropTypes.object.isRequired,
	},

	shouldComponentUpdate() {
		return false;
	},

	render() {
		const { message } = this.props;
		
		return (
			<div className={ 'ui item message-list-item status-message ' + message.severity }>
				{ !message.time ? null : <TimeStamp message={ message }/> }
				<MessageText 
					message={ message }
					emojify={ false }
				/>
			</div>
		);
	}
});

export { ChatMessage, StatusMessage };
