import React from 'react';

//import { PriorityEnum } from 'constants/QueueConstants';
//import QueueActions from 'actions/QueueActions';

import Dropdown from 'components/semantic/Dropdown';
import DropdownItem from 'components/semantic/DropdownItem';

import { SHARE_PROFILES_URL, HIDDEN_PROFILE_ID } from 'constants/ShareConstants';

import SocketService from 'services/SocketService';

const ProfileDropdown = React.createClass({
	propTypes: {
		/**
		 * Priority object
		 */
		onClickProfile: React.PropTypes.func.isRequired,

		/**
		 * Priority object
		 */
		onProfilesReceived: React.PropTypes.func.isRequired,

		/**
		 * Item with priority properties
		 */
		//item: React.PropTypes.object.isRequired,
	},

	componentDidMount() {
		this.fetchProfiles();
	},

	onProfilesReceived(data) {
		const defaultItem = { name: 'All profiles', id: null };
		//const profiles = [ { name: 'All profiles', id: null } ];
		const profiles = [ defaultItem ];
		profiles.push(...data.filter(p => p.id !== HIDDEN_PROFILE_ID));

		this.setState({
			profiles: profiles,
			selectedProfile: defaultItem,
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
			selectedProfile: null,
		};
	},

	onClick: function (profile) {
		this.props.onClickProfile(profile);
		this.setState({ selectedProfile: profile });
	},

	getDropdownItem: function (profile) {
		return (
			<DropdownItem 
				key={ profile.id }
				active={ this.state.selectedProfile ? this.state.selectedProfile.id === profile.id : false } 
				onClick={ () => this.onClick(profile) }
			>
				{ profile.name }
			</DropdownItem>
		);
	},

	getCaption() {
		return this.state.selectedProfile.name;
	},

	render: function () {
		if (!this.state.profiles) {
			return null;
		}

		return (
			<Dropdown className="labeled icon top right pointing button" caption={this.getCaption()} triggerIcon="filter">
				<div className="header">
					<i className="filter icon"></i>
					Filter by profile
				</div>
				{ this.state.profiles.map(this.getDropdownItem) }
			</Dropdown>
		);
	}
});

export default ProfileDropdown;