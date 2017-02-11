import React from 'react';

import UserSearchInput from 'components/autosuggest/UserSearchInput';
import RecentLayout from 'routes/Sidebar/components/RecentLayout';

import FilelistActions from 'actions/FilelistActions';
import FilelistSessionStore from 'stores/FilelistSessionStore';

import ShareProfileSelector from './ShareProfileSelector';
import HistoryConstants from 'constants/HistoryConstants';


const FilelistNew = React.createClass({
	handleSubmit(nick, user) {
		FilelistActions.createSession(this.props.location, user, FilelistSessionStore);
	},

	onProfileChanged(profileId) {
		FilelistActions.ownList(this.props.location, profileId, FilelistSessionStore);
	},

	recentUserRender(entry) {
		return (
			<a onClick={ _ => this.handleSubmit(null, entry.user) }>
				{ entry.user.nicks }
			</a> 
		);
	},

	hasSession(entry) {
		return FilelistSessionStore.getSession(entry.user.cid);
	},

	render() {
		return (
			<div className="session new">
				<UserSearchInput 
					submitHandler={ this.handleSubmit } 
					offlineMessage="You must to be connected to at least one hub in order to download filelists from other users"
				/>
 				<ShareProfileSelector 
 					onProfileChanged={ this.onProfileChanged }
 				/>
				<RecentLayout
					url={ HistoryConstants.FILELISTS_URL }
					hasSession={ this.hasSession }
					entryTitleRenderer={ this.recentUserRender }
					entryIcon="browser"
				/>
			</div>
		);
	}
});

export default FilelistNew;
