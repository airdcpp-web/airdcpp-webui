import React from 'react';

import { SHARE_MODULE_URL, SHARE_PROFILES_URL, HIDDEN_PROFILE_ID, SHARE_PROFILE_ADDED, SHARE_PROFILE_UPDATED, SHARE_PROFILE_REMOVED } from 'constants/ShareConstants';
import SocketService from 'services/SocketService';

import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';
import Loader from 'components/semantic/Loader';

export default function (Component, listHidden) {
	const ShareProfileDecorator = React.createClass({
		mixins: [ SocketSubscriptionMixin ],
		//propTypes: {
			/**
			 * Callback after the profiles have been received
			 */
		//	onProfilesReceived: React.PropTypes.func,
		//},

		onSocketConnected(addSocketListener) {
			addSocketListener(SHARE_MODULE_URL, SHARE_PROFILE_ADDED, this.fetchProfiles);
			addSocketListener(SHARE_MODULE_URL, SHARE_PROFILE_UPDATED, this.fetchProfiles);
			addSocketListener(SHARE_MODULE_URL, SHARE_PROFILE_REMOVED, this.fetchProfiles);
		},

		componentDidMount() {
			this.fetchProfiles();
		},

		onProfilesReceived(data) {
			//const defaultItem = { name: 'All profiles', id: null };
			//const profiles = [ { name: 'All profiles', id: null } ];
			//const profiles = [ defaultItem ];
			const profiles = [];
			profiles.push(...data.filter(p => listHidden || p.id !== HIDDEN_PROFILE_ID));

			this.setState({
				profiles: profiles,
			});
		},

		fetchProfiles() {
			SocketService.get(SHARE_PROFILES_URL)
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
