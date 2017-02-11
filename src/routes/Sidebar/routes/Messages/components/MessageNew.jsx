import React from 'react';

import UserSearchInput from 'components/autosuggest/UserSearchInput';
import RecentLayout from 'routes/Sidebar/components/RecentLayout';

import PrivateChatActions from 'actions/PrivateChatActions';
import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';

import HistoryConstants from 'constants/HistoryConstants';


const MessageNew = React.createClass({
	handleSubmit(nick, user) {
		PrivateChatActions.createSession(this.props.location, user, PrivateChatSessionStore);
	},

	recentUserRender(entry) {
		return (
			<a onClick={ _ => this.handleSubmit(null, entry.user) }>
				{ entry.user.nicks }
			</a> 
		);
	},

	hasSession(entry) {
		return PrivateChatSessionStore.getSession(entry.user.cid);
	},

	render() {
		return (
			<div className="session new"> 
				<UserSearchInput 
					submitHandler={ this.handleSubmit } 
					offlineMessage="You must to be connected to at least one hub in order to send private messages"
				/>
				<RecentLayout
					url={ HistoryConstants.PRIVATE_CHATS_URL }
					hasSession={ this.hasSession }
					entryTitleRenderer={ this.recentUserRender }
					entryIcon="comments"
				/>
			</div>
		);
	}
});

export default MessageNew;
