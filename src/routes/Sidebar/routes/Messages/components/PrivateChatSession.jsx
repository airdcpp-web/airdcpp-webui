'use strict';
import React from 'react';

import ChatLayout from 'routes/Sidebar/components/chat/ChatLayout';
import MessageFooter from './MessageFooter';

import PrivateChatMessageStore from 'stores/PrivateChatMessageStore';

import AccessConstants from 'constants/AccessConstants';
import { LocationContext } from 'mixins/RouterMixin';


const ChatSession = React.createClass({
	mixins: [ LocationContext ],
	render() {
		const { session, location, actions } = this.props;
		return (
			<div className="private chat session">
				<ChatLayout
					location={ location }
					chatAccess={ AccessConstants.PRIVATE_CHAT_SEND }
					messageStore={ PrivateChatMessageStore }
					actions={ actions }
					session={ session }
				/>

				<MessageFooter
					session={ session }
				/>
			</div>
		);
	},
});

export default ChatSession;
