import React from 'react';
import Reflux from 'reflux';

import CountLabel from 'components/CountLabel';
import LabelInfo from 'utils/LabelInfo';

import SideMenuLayout from 'routes/Sidebar/components/SideMenuLayout';

import TypeConvert from 'utils/TypeConvert';

import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';

const Messages = React.createClass({
	mixins: [ Reflux.connect(PrivateChatSessionStore, 'chatSessions') ],
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
				{ this.props.children }
			</SideMenuLayout>
	);
	}
});

export default Messages;
