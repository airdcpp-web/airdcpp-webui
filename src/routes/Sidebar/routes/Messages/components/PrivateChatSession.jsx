'use strict';
import React from 'react';
import ReactDOM from 'react-dom';

import ChatLayout from 'routes/Sidebar/components/chat/ChatLayout';
import { SessionFooter } from 'routes/Sidebar/components/SessionFooter';
import CCPMState from './CCPMState';

import PrivateChatMessageStore from 'stores/PrivateChatMessageStore';
import PrivateChatActions from 'actions/PrivateChatActions';

import AccessConstants from 'constants/AccessConstants';


const ChatSession = React.createClass({
	render() {
		const { item, location } = this.props;
		return (
			<div className="private chat session">
				<ChatLayout
					location={ location }
					chatAccess={ AccessConstants.PRIVATE_CHAT_SEND }
					messageStore={ PrivateChatMessageStore }
					chatActions={ PrivateChatActions }
					session={ item }
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

export default ChatSession;
