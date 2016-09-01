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
		return (
			<SessionLayout 
				activeId={this.props.params ? this.props.params.id : null}
				baseUrl="messages"
				itemUrl="messages/session"
				location={this.props.location}
				items={this.state.chatSessions}
				newButtonCaption="New session"
				unreadInfoStore={ PrivateChatSessionStore }
				editAccess={ AccessConstants.PRIVATE_CHAT_EDIT }
				actions={ PrivateChatActions }
				actionIds={ [ 'clear' ] }

				{ ...UserItemHandlerDecorator([ 'browse', 'ignore', 'unignore' ]) }
			>
				{ this.props.children }
			</SessionLayout>
	);
	}
});

export default Messages;
