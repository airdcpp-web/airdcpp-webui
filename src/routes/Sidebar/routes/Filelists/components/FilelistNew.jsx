import React from 'react';

import UserSearchInput from 'components/autosuggest/UserSearchInput';
import NewLayout from 'routes/Sidebar/components/NewLayout';
import FilelistActions from 'actions/FilelistActions';

import ShareProfileSelector from './ShareProfileSelector';


const Messages = React.createClass({
	_handleSubmit(nick, user) {
		FilelistActions.createSession(this.props.location, user);
	},

	onProfileChanged(profileId) {
		FilelistActions.ownList(this.props.location, profileId);
	},

	render() {
		return (
			<NewLayout title="Open list" subHeader="Start browsing a new filelist" icon="sitemap" className="filelist">
				<UserSearchInput submitHandler={this._handleSubmit} offlineMessage="You must to be connected to at least one hub in order to download filelists from other users"/>
 				<ShareProfileSelector onProfileChanged={ this.onProfileChanged }/>
			</NewLayout>
		);
	}
});

export default Messages;
