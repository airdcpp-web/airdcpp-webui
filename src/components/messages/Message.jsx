'use strict';
import React from 'react';

import TextDecorator from 'components/TextDecorator';
import ValueFormat from 'utils/ValueFormat';

import Icon from 'components/semantic/Icon';
import IconConstants from 'constants/IconConstants';
import { SeverityEnum } from 'constants/EventConstants';

import { UserMenu } from 'components/menu/DropdownMenu';


// Message sections
const Author = ({ message, dropdownContextGetter }) => (
	<div className="header author">
		{ message.third_person && <span>*</span> }
		<UserMenu 
			contextGetter={ dropdownContextGetter } 
			triggerIcon={ null } 
			noIcon={ true } 
			user={ message.from }
		/>
	</div>
);

Author.propTypes = {
	message: React.PropTypes.object.isRequired,
	dropdownContextGetter: React.PropTypes.func.isRequired,
};

const TimeStamp = ({ message }) => (
	<div className="time">
		{ ValueFormat.formatTimestamp(message.time) }
	</div>
);

const MessageText = ({ message, emojify }) => (
	<div className="text">
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


// Main message types
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
			<div className={ 'ui item chat ' + message.from.flags.join(' ')}>
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


const getSeverityIcon = (severity) => {
	switch (severity) {
		case SeverityEnum.INFO: return IconConstants.INFO + ' circle';
		case SeverityEnum.WARNING: return IconConstants.WARNING;
		case SeverityEnum.ERROR: return IconConstants.ERROR;
		default: return '';
	}
};

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
			<div className={ 'ui item status ' + message.severity }>
				<Icon icon={ getSeverityIcon(message.severity) }/>
				{ message.time ? <TimeStamp message={ message }/> : null }
				<MessageText 
					message={ message }
					emojify={ false }
				/>
			</div>
		);
	}
});

export { ChatMessage, StatusMessage };
