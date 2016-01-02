'use strict';

import React from 'react';

import MessageComposer from './MessageComposer';
import MessageView from './MessageView';

import LoginStore from 'stores/LoginStore';

import './messages.css';


const ChatLayout = React.createClass({
	propTypes: {
		/**
		 * Access required for sending messages
		 */
		chatAccess: React.PropTypes.string.isRequired,
	},

	handleSend(message) {
		this.props.chatActions.sendMessage(this.props.item.id, message);
	},

	render() {
		const { chatAccess, location, chatActions, messageStore, session } = this.props;
		return (
			<div className="message-view">
				<MessageView 
					messageStore={ messageStore }
					chatActions={ chatActions }
					location={ location }
					session={ session }
				/>
				{ LoginStore.hasAccess(chatAccess) ? (
					<MessageComposer 
						handleSend={ this.handleSend }
						location={ location }
					/>
				) : null }
			</div>
		);
	},
});

export default ChatLayout;
