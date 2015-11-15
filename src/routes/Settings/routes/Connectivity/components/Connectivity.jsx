'use strict';

import React from 'react';
import GridLayout from 'routes/Settings/components/GridLayout';

const Connectivity = React.createClass({
	render() {
		const menuItems = [
			{ title: 'Auto detection', url: 'detection' },
		];

		const advancedMenuItems = [
			{ title: 'IPv4 connectivity (manual)', url: 'v4' },
			{ title: 'IPv6 connectivity (manual)', url: 'v6' },
			{ title: 'Ports (manual)', url: 'ports' },
		];

		return (
			<GridLayout 
				menuItems={ menuItems }
				advancedMenuItems={ advancedMenuItems }
				id="connectivity"
				icon="signal"
				{...this.props}
			/>
		);
	},
});

export default Connectivity;
