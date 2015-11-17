'use strict';

import React from 'react';
import GridLayout from 'routes/Settings/components/GridLayout';

const General = React.createClass({
	render() {
		const menuItems = [
			{ title: 'Locations', url: 'locations' },
		];

		const advancedMenuItems = [
			{ title: 'Skipping options', url: 'skipping-options' },
			{ title: 'Search matching', url: 'search-matching' },
			{ title: 'Download options', url: 'download-options' }
		];

		return (
			<GridLayout 
				menuItems={ menuItems }
				advancedMenuItems={ advancedMenuItems }
				id="downloads"
				icon="download"
				{...this.props}
			/>
		);
	},
});

export default General;
