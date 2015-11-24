import React from 'react';

import Dropdown from 'components/semantic/Dropdown';
import DropdownItem from 'components/semantic/DropdownItem';

import ShareProfileDecorator from 'decorators/ShareProfileDecorator';


const defaultItem = { name: 'All profiles', id: null };

const ProfileDropdown = React.createClass({
	propTypes: {
		/**
		 * Callback after selecting a profile
		 */
		onClickProfile: React.PropTypes.func.isRequired,
	},

	getInitialState() {
		return {
			selectedProfile: defaultItem,
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
		return (
			<Dropdown className="labeled icon top right pointing button" caption={this.getCaption()} triggerIcon="filter">
				<div className="header">
					<i className="filter icon"></i>
					Filter by profile
				</div>
				{ [ defaultItem, ...this.props.profiles ].map(this.getDropdownItem) }
			</Dropdown>
		);
	}
});

export default ShareProfileDecorator(ProfileDropdown, false);