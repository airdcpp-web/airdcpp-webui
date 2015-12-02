import React from 'react';

import UserSearchInput from 'components/autosuggest/UserSearchInput';
import NewLayout from 'routes/Sidebar/components/NewLayout';

import FilelistActions from 'actions/FilelistActions';


const Messages = React.createClass({
	_handleSubmit(user) {
		FilelistActions.createSession(this.props.location, user);
	},

	render() {
		return (
			<NewLayout title="Open list" subHeader="Start browsing a new filelist" icon="sitemap">
				<UserSearchInput submitHandler={this._handleSubmit} offlineMessage="You must to be connected to at least one hub in order to download filelists from other users"/>
			</NewLayout>
		);
	}
});

export default Messages;
