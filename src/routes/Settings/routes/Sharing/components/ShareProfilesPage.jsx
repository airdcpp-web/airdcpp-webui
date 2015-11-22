import React from 'react';
import ReactDOM from 'react-dom';

import ShareProfileActions from 'actions/ShareProfileActions';
import { SHARE_PROFILE_ADDED, SHARE_PROFILE_UPDATED, SHARE_PROFILE_REMOVED, SHARE_PROFILES_URL, HIDDEN_PROFILE_ID, SHARE_MODULE_URL } from 'constants/ShareConstants';

import Button from 'components/semantic/Button';
import SocketService from 'services/SocketService';
import Formatter from 'utils/Format';

import { ActionMenu } from 'components/Menu';
import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';

const Row = ({ profile, contextGetter }) => (
	<tr>
		<td>
			<ActionMenu 
				caption={ <strong>{profile.name}</strong> } 
				actions={ ShareProfileActions } 
				ids={ profile.default ? [ 'edit', 'remove' ] : [ 'edit', 'default', 'remove' ]} 
				itemData={ profile }
				contextGetter={ contextGetter }
			/>
		</td>
		<td>
			{ Formatter.formatSize(profile.size) }
		</td>
		<td>
			{ profile.files }
		</td>
	</tr>
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

				<table className="ui striped table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Total size</th>
							<th>Total files</th>
						</tr>
					</thead>
					<tbody>
					{ this.state.profiles
						.filter(p => p.id !== HIDDEN_PROFILE_ID)
						.map(p => <Row key={p.id} profile={p} contextGetter={ () => ReactDOM.findDOMNode(this) }/>) 
					}
					</tbody>
				</table>
			</div>
		);
	}
});

export default ShareProfilesPage;