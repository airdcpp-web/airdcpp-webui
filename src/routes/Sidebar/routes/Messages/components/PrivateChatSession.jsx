'use strict';
import React from 'react';
import ReactDOM from 'react-dom';

import ChatLayout from 'routes/Sidebar/components/chat/ChatLayout';
import { SessionFooter } from 'routes/Sidebar/components/SessionFooter';
import CCPMState from './CCPMState';
import ChatSessionDecorator from 'decorators/ChatSessionDecorator';

import PrivateChatMessageStore from 'stores/PrivateChatMessageStore';
import PrivateChatActions from 'actions/PrivateChatActions';

import AccessConstants from 'constants/AccessConstants';


const ChatSession = React.createClass({
	handleSend(message) {
		PrivateChatActions.sendMessage(this.props.item.id, message);
	},

	render() {
		const { item, messages, location } = this.props;
		return (
			<div className="private chat session">
				<ChatLayout
					messages={ messages }
					handleSend={ this.handleSend }
					location={ location }
					chatAccess={ AccessConstants.PRIVATE_CHAT_SEND }
				/>
				{ item.ccpm_state.supported ? ( 
					<SessionFooter>
						<CCPMState 
							state={ item.ccpm_state.id } 
							item={ item }
							contextGetter={ () => ReactDOM.findDOMNode(this) }
						/>
					</SessionFooter>
				) : null }
			</div>
		);
	},
});

export default ChatSessionDecorator(ChatSession, PrivateChatMessageStore, PrivateChatActions);
