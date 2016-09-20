import React from 'react';
import Reflux from 'reflux';

import SessionLayout from 'routes/Sidebar/components/SessionLayout';
import UserItemHandlerDecorator from 'routes/Sidebar/decorators/UserItemHandlerDecorator';

import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';
import PrivateChatActions from 'actions/PrivateChatActions';

import AccessConstants from 'constants/AccessConstants';

import '../style.css';


const Messages = React.createClass({
	mixins: [ Reflux.connect(PrivateChatSessionStore, 'chatSessions') ],

	render() {
		const { params, ...other } = this.props;
		return (
			<SessionLayout 
				activeId={ params.id }
				baseUrl="messages"
				itemUrl="messages/session"
				items={ this.state.chatSessions }
				newButtonCaption="New session"
				unreadInfoStore={ PrivateChatSessionStore }
				editAccess={ AccessConstants.PRIVATE_CHAT_EDIT }
				actions={ PrivateChatActions }
				actionIds={ [ 'clear' ] }

				{ ...UserItemHandlerDecorator([ 'browse', 'ignore', 'unignore' ]) }
				{ ...other }
			>
				{ this.props.children }
			</SessionLayout>
	);
	}
});

export default Messages;
