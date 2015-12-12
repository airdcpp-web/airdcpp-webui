import React from 'react';

import ShareProfileConstants from 'constants/ShareProfileConstants';
import SocketService from 'services/SocketService';

import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';
import Loader from 'components/semantic/Loader';
import ValueFormat from 'utils/ValueFormat';

export default function (Component, listHidden, addSize = true) {
	const ShareProfileDecorator = React.createClass({
		mixins: [ SocketSubscriptionMixin() ],

		onSocketConnected(addSocketListener) {
			const url = ShareProfileConstants.PROFILE_MODULE_URL;
			addSocketListener(url, ShareProfileConstants.PROFILE_ADDED, this.fetchProfiles);
			addSocketListener(url, ShareProfileConstants.PROFILE_UPDATED, this.fetchProfiles);
			addSocketListener(url, ShareProfileConstants.PROFILE_REMOVED, this.fetchProfiles);
		},

		componentDidMount() {
			this.fetchProfiles();
		},

		convertProfile(profile) {
			let name = profile.name;
			if (addSize && profile.id !== ShareProfileConstants.HIDDEN_PROFILE_ID) {
				name += ' (' + ValueFormat.formatSize(profile.size) + ')';
			}

			return Object.assign({},
				profile,
				{ name: name }
 			);
		},

		onProfilesReceived(data) {
			const profiles = [];
			profiles.push(...data
				.filter(p => listHidden || p.id !== ShareProfileConstants.HIDDEN_PROFILE_ID)
				.map(this.convertProfile)
			);

			this.setState({
				profiles: profiles,
			});
		},

		fetchProfiles() {
			SocketService.get(ShareProfileConstants.PROFILES_URL)
				.then(this.onProfilesReceived)
				.catch(error => 
					console.error('Failed to load profiles: ' + error)
				);
		},

		getInitialState() {
			return {
				profiles: null,
			};
		},

		render() {
			if (!this.state.profiles) {
				return <Loader text="Loading profiles"/>;
			}

			return <Component {...this.props} {...this.state}/>;
		},
	});

	return ShareProfileDecorator;
}
