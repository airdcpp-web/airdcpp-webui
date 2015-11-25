import React from 'react';

import ShareRootActions from 'actions/ShareRootActions';

import Button from 'components/semantic/Button';
import ShareDirectoryLayout from './ShareDirectoryLayout';
import ProfileDropdown from './ProfileDropdown';

import '../style.css';

const ShareDirectoriesPage = React.createClass({
	getInitialState() {
		return {
			selectedProfileId: null,
		};
	},

	_handleAddDirectory() {
		ShareRootActions.create(this.props.location);
	},

	onClickProfile(profile) {
		this.setState({ selectedProfileId: profile.id });
	},

	onProfilesReceived(profiles) {

	},

	render() {
		return (
			<div className="share-directories-settings">
				<div className="actions">
					<Button
						icon="plus icon"
						onClick={this._handleAddDirectory}
						caption="Add directory"
					/>
					<ProfileDropdown onClickProfile={ this.onClickProfile } onProfilesReceived={ this.onProfilesReceived }/>
				</div>
				<ShareDirectoryLayout className="directory-layout" selectedProfileId={ this.state.selectedProfileId } location={ this.props.location }/>
			</div>
		);
	}
});

export default ShareDirectoriesPage;