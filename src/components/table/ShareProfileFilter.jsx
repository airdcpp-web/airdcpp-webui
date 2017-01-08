import React from 'react';

import Dropdown from 'components/semantic/Dropdown';
import { MenuItemLink } from 'components/semantic/MenuItem';

import ShareProfileDecorator from 'decorators/ShareProfileDecorator';
import TableFilterDecorator from 'decorators/TableFilterDecorator';

const defaultItem = { name: 'All profiles', id: null };

const ShareProfileFilter = React.createClass({
	propTypes: {
		/**
		 * Callback after selecting a profile
		 */
		onFilterUpdated: React.PropTypes.func,
	},

	getInitialState() {
		return {
			selectedProfile: defaultItem,
		};
	},

	onClick: function (profile) {
		this.props.onFilterUpdated(profile.id);
		this.setState({ 
			selectedProfile: profile 
		});
	},

	getDropdownItem: function (profile) {
		return (
			<MenuItemLink 
				key={ profile.id }
				active={ this.state.selectedProfile ? this.state.selectedProfile.id === profile.id : false } 
				onClick={ () => this.onClick(profile) }
			>
				{ profile.str }
			</MenuItemLink>
		);
	},

	render: function () {
		return (
			<Dropdown 
				className="top right pointing" 
				caption={ this.state.selectedProfile.str } 
				triggerIcon="filter" 
				button={true}
			>
				<div className="header">
					<i className="filter icon"/>
					Filter by profile
				</div>
				{ [ defaultItem, ...this.props.profiles ].map(this.getDropdownItem) }
			</Dropdown>
		);
	}
});

export default ShareProfileDecorator(TableFilterDecorator(ShareProfileFilter, 'profiles'), false);