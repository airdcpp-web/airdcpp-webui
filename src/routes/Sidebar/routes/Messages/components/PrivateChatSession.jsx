'use strict';
import React from 'react';

import ChatLayout from 'routes/Sidebar/components/chat/ChatLayout';
import ChatSessionDecorator from 'decorators/ChatSessionDecorator';

import PrivateChatMessageStore from 'stores/PrivateChatMessageStore';
import PrivateChatActions from 'actions/PrivateChatActions';

import AccessConstants from 'constants/AccessConstants';


const ChatSession = React.createClass({
	handleSend(message) {
		PrivateChatActions.sendMessage(this.props.item.id, message);
	},

	render() {
		return (
			<div className="private chat session">
				<ChatLayout
					messages={this.props.messages}
					handleSend={this.handleSend}
					location={this.props.location}
					chatAccess={ AccessConstants.PRIVATE_CHAT_SEND }
				/>
			</div>
		);
	},
});

export default ChatSessionDecorator(ChatSession, PrivateChatMessageStore, PrivateChatActions);
