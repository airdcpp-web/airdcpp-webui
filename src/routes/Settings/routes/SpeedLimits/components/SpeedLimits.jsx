'use strict';

import React from 'react';
import GridLayout from 'routes/Settings/components/GridLayout';

const SpeedLimits = React.createClass({
	render() {
		const menuItems = [
			{ title: 'Connection speed', url: 'speed' },
			{ title: 'Bandwidth limiting', url: 'limiter' },
		];

		const advancedMenuItems = [
			{ title: 'Download limits', url: 'download-limits' },
			{ title: 'Upload limits', url: 'upload-limits' },
			{ title: 'Per-user limits', url: 'user-limits' },
		];

		return (
			<GridLayout 
				menuItems={ menuItems } 
				advancedMenuItems={ advancedMenuItems }
				id="speed-limits"
				icon="dashboard"
				{...this.props}
			/>
		);
	},
});

export default SpeedLimits;
