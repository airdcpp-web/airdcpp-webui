import React from 'react';
import Reflux from 'reflux';

import CountLabel from 'components/CountLabel';
import LabelInfo from 'utils/LabelInfo';

import SessionLayout from 'routes/Sidebar/components/SessionLayout';
import UserItemHandlerDecorator from 'routes/Sidebar/decorators/UserItemHandlerDecorator';

import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';
import PrivateChatActions from 'actions/PrivateChatActions';

const ItemHandler = {
	itemLabelGetter(session) {
		return <CountLabel unreadInfo={ LabelInfo.getPrivateChatUnreadInfo(session.unread_messages)}/>;
	},

	itemCloseHandler(session) {
		PrivateChatActions.removeSession(session.id);
	},
};

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

				{ ...UserItemHandlerDecorator(ItemHandler, [ 'browse' ]) }
			>
				{ this.props.children }
			</SessionLayout>
	);
	}
});

export default Messages;
