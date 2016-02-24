'use strict';
import React from 'react';
import ReactDOM from 'react-dom';

import ChatLayout from 'routes/Sidebar/components/chat/ChatLayout';
import MessageFooter from './MessageFooter';

import PrivateChatMessageStore from 'stores/PrivateChatMessageStore';
import PrivateChatActions from 'actions/PrivateChatActions';

import AccessConstants from 'constants/AccessConstants';
import { LocationContext } from 'mixins/RouterMixin';


const ChatSession = React.createClass({
	mixins: [ LocationContext ],
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

				<MessageFooter
					item={ item }
					contextGetter={ () => ReactDOM.findDOMNode(this) }
				/>
			</div>
		);
	},
});

export default ChatSession;
