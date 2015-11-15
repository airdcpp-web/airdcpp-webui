'use strict';

import React from 'react';
import GridLayout from 'routes/Settings/components/GridLayout';

const General = React.createClass({
	render() {
		const menuItems = [
			{ title: 'Locations', url: 'locations' },
			//{ title: 'Usage profile', url: 'profile' }
		];

		return (
			<GridLayout 
				menuItems={ menuItems } 
				id="downloads"
				icon="download"
				{...this.props}
			/>
		);
	},
});

export default General;
