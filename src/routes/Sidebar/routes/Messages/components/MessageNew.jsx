import React from 'react';

import UserSearchInput from 'components/autosuggest/UserSearchInput';
import NewLayout from 'routes/Sidebar/components/NewLayout';

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
			<NewLayout 
				title="Send message" 
				subHeader="Start a new private chat session" 
				icon="comments"
				recentUrl={ HistoryConstants.PRIVATE_CHATS_URL }
				recentTitleRenderer={ this.recentUserRender }
				hasSession={ this.hasSession }
			>
				<UserSearchInput 
					submitHandler={ this.handleSubmit } 
					offlineMessage="You must to be connected to at least one hub in order to send private messages"
				/>
			</NewLayout>
		);
	}
});

export default MessageNew;
