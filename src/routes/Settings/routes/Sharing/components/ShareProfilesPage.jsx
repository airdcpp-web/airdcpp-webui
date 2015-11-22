import React from 'react';
//import SettingForm from 'routes/Settings/components/SettingForm';
//import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import ShareProfileActions from 'actions/ShareProfileActions';
import { SHARE_PROFILE_ADDED, SHARE_PROFILE_UPDATED, SHARE_PROFILE_REMOVED, SHARE_PROFILES_URL, HIDDEN_PROFILE_ID, SHARE_MODULE_URL } from 'constants/ShareConstants';

import Button from 'components/semantic/Button';
import SocketService from 'services/SocketService';
import { TableActionMenu } from 'components/Menu';
import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';

const Row = ({ profile }) => (
	<div className="ui row">
		<div className="ten wide column">
			<div className="ui tiny header">
				<TableActionMenu caption={ profile.name } actions={ ShareProfileActions } ids={[ 'edit', 'remove' ]} itemData={ profile }/>
			</div>
		</div>
		<div className="six wide column">
			{ profile.size }
		</div>
	</div>
);

const ShareProfilesPage = React.createClass({
	mixins: [ SocketSubscriptionMixin ],
	componentDidMount() {
		this.fetchProfiles();
	},

	fetchProfiles() {
		SocketService.get(SHARE_PROFILES_URL)
			.then(this.onProfilesReceived)
			.catch(error => 
				console.error('Failed to load profiles: ' + error)
			);
	},

	onSocketConnected(addSocketListener) {
		addSocketListener(SHARE_MODULE_URL, SHARE_PROFILE_ADDED, this.fetchProfiles);
		addSocketListener(SHARE_MODULE_URL, SHARE_PROFILE_UPDATED, this.fetchProfiles);
		addSocketListener(SHARE_MODULE_URL, SHARE_PROFILE_REMOVED, this.fetchProfiles);
	},

	getInitialState() {
		return {
			profiles: null,
		};
	},

	_handleAddProfile() {
		ShareProfileActions.create();
	},

	onProfilesReceived(data) {
		this.setState({ profiles: data });
	},

	render() {
		if (!this.state.profiles) {
			return null;
		}

		return (
			<div className="share-profiles-settings">
				<Button
					icon="plus icon"
					onClick={this._handleAddProfile}
					caption="Add profile"
				/>

				<div className="ui vertically divided grid two column">
					{ this.state.profiles
						.filter(p => p.id !== HIDDEN_PROFILE_ID)
						.map(p => <Row key={p.id} profile={p}/>) }
				</div>
			</div>
		);
	}
});

export default ShareProfilesPage;