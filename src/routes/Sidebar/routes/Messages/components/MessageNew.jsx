import React from 'react';

import UserSearchInput from 'components/autosuggest/UserSearchInput';
import NewLayout from 'routes/Sidebar/components/NewLayout';

import PrivateChatActions from 'actions/PrivateChatActions';


const MessageNew = React.createClass({
	_handleSubmit(user) {
		PrivateChatActions.createSession(this.props.location, user);
	},

	render() {
		return (
			<NewLayout title="Send message" subHeader="Start a new private chat session" icon="comments">
				<UserSearchInput submitHandler={this._handleSubmit} offlineMessage="You must to be connected to at least one hub in order to send private messages"/>
			</NewLayout>
		);
	}
});

export default MessageNew;
