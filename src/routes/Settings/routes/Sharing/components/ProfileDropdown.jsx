import React from 'react';

import Dropdown from 'components/semantic/Dropdown';
import DropdownItem from 'components/semantic/DropdownItem';

import ShareProfileDecorator from 'decorators/ShareProfileDecorator';
import TableFilterDecorator from 'decorators/TableFilterDecorator';

const defaultItem = { name: 'All profiles', id: null };

const ProfileDropdown = React.createClass({
	propTypes: {
		/**
		 * Callback after selecting a profile
		 */
		onFilterUpdated: React.PropTypes.func.isRequired,
	},

	getInitialState() {
		return {
			selectedProfile: defaultItem,
		};
	},

	onClick: function (profile) {
		this.props.onFilterUpdated(profile.id);
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
			<Dropdown className="top right pointing" caption={this.getCaption()} triggerIcon="filter" button={true}>
				<div className="header">
					<i className="filter icon"></i>
					Filter by profile
				</div>
				{ [ defaultItem, ...this.props.profiles ].map(this.getDropdownItem) }
			</Dropdown>
		);
	}
});

export default ShareProfileDecorator(TableFilterDecorator(ProfileDropdown, 'profiles'), false);