import React from 'react';

import Dropdown from 'components/semantic/Dropdown';
import DropdownItem from 'components/semantic/DropdownItem';

import ShareProfileDecorator from 'decorators/ShareProfileDecorator';


const ShareProfileSelector = React.createClass({
	propTypes: {
		/**
		 * Callback after selecting a profile
		 */
		onProfileChanged: React.PropTypes.func.isRequired,
	},

	onClick: function (profile) {
		this.props.onProfileChanged(profile.id);
	},

	getDropdownItem: function (profile) {
		return (
			<DropdownItem 
				key={ profile.id } 
				onClick={ () => this.props.onProfileChanged(profile.id) }
			>
				{ profile.name }
			</DropdownItem>
		);
	},

	render: function () {
		return (
			<Dropdown className="profile top right pointing" caption="Browse own share..." triggerIcon="">
				{ this.props.profiles.map(this.getDropdownItem) }
			</Dropdown>
		);
	}
});

export default ShareProfileDecorator(ShareProfileSelector, false);