import React from 'react';

import UserSearchInput from 'components/autosuggest/UserSearchInput';
import NewLayout from 'routes/Sidebar/components/NewLayout';

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
			<NewLayout 
				title="Open list" 
				subHeader="Start browsing a new filelist" 
				icon="browser" 
				className="filelist"
				recentUrl={ HistoryConstants.FILELISTS_URL }
				recentTitleRenderer={ this.recentUserRender }
				hasSession={ this.hasSession }
			>
				<UserSearchInput 
					submitHandler={ this.handleSubmit } 
					offlineMessage="You must to be connected to at least one hub in order to download filelists from other users"
				/>
 				<ShareProfileSelector 
 					onProfileChanged={ this.onProfileChanged }
 				/>
			</NewLayout>
		);
	}
});

export default FilelistNew;
