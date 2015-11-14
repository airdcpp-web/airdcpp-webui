'use strict';

import React from 'react';
import GridLayout from 'routes/Settings/components/GridLayout';

const SpeedSlots = React.createClass({
	render() {
		const menuItems = [
			{ title: 'Speed', url: 'speed' },
			//{ title: 'Usage profile', url: 'profile' }
		];

		return (
			<GridLayout 
				menuItems={ menuItems } 
				id="speed-slots"
				icon="dashboard"
				{...this.props}
			/>
		);
	},
});

export default SpeedSlots;
