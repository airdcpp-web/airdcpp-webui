'use strict';

import React from 'react';
import GridLayout from 'routes/Settings/components/GridLayout';

const Connectivity = React.createClass({
	render() {
		const menuItems = [
			{ title: 'Auto Detection', url: 'detection' },
			{ title: 'IPv4 connectivity (manual)', url: 'v4' },
			{ title: 'IPv6 connectivity (manual)', url: 'v6' },
			{ title: 'Ports (manual)', url: 'ports' },
		];

		return (
			<GridLayout 
				menuItems={ menuItems } 
				id="connectivity"
				icon="signal"
				{...this.props}
			/>
		);
	},
});

export default Connectivity;
