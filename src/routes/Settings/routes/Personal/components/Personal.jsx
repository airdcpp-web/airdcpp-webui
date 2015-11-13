'use strict';

import React from 'react';
import GridLayout from 'routes/Settings/components/GridLayout';

const General = React.createClass({
	render() {
		const menuItems = [
			{ title: 'User Profile', url: 'profile' },
			//{ title: 'Usage profile', url: 'profile' }
		];

		return (
			<GridLayout 
				menuItems={ menuItems } 
				id="personal"
				icon="user"
				{...this.props}
			/>
		);
	},
});

export default General;
