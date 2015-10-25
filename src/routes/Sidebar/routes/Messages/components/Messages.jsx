import React from 'react';
import Reflux from 'reflux';

import UserSearchInput from 'components/autosuggest/UserSearchInput';

import CountLabel from 'components/CountLabel';
import LabelInfo from 'utils/LabelInfo';

import SideMenuLayout from 'routes/Sidebar/components/SideMenuLayout';
import NewLayout from 'routes/Sidebar/components/NewLayout';

import TypeConvert from 'utils/TypeConvert';

import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';
import PrivateChatActions from 'actions/PrivateChatActions';

const Messages = React.createClass({
	mixins: [ Reflux.connect(PrivateChatSessionStore, 'chatSessions') ],
	displayName: 'Messages',
	_handleSubmit(user) {
		PrivateChatActions.createSession(user, this.props.location);
	},

	_nameGetter(session) {
		return session.user.nicks;
	},

	_idGetter(session) {
		return session.user.cid;
	},

	_labelGetter(session) {
		return <CountLabel unreadInfo={ LabelInfo.getPrivateChatUnreadInfo(session.unread_messages)}/>;
	},

	_statusGetter(session) {
		const { flags } = session.user;
		return TypeConvert.userOnlineStatusToColor(flags);
	},

	render() {
		return (
			<SideMenuLayout 
				activeId={this.props.params ? this.props.params.id : null}
				baseUrl="messages"
				itemUrl="messages/session"
				location={this.props.location} 
				items={this.state.chatSessions} 
				nameGetter={this._nameGetter} 
				labelGetter={this._labelGetter}
				statusGetter={this._statusGetter}
				newButtonLabel="New session"
			>
				{ this.props.children ? 
					this.props.children :
				(<NewLayout title="Send message" subheader="Start a new private chat session" icon="comments">
					<UserSearchInput submitHandler={this._handleSubmit} offlineMessage="You must to be connected to at least one hub in order to send private messages"/>
				</NewLayout>) }
			</SideMenuLayout>
	);
	}
});

export default Messages;
