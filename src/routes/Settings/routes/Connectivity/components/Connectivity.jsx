'use strict';

import React from 'react';
import GridLayout from 'routes/Settings/components/GridLayout';

const General = React.createClass({
	render() {
		const menuItems = [
			{ title: 'Auto Detection', url: 'detection' },
			{ title: 'Manual (IPv4)', url: 'v4' },
			{ title: 'Manual (IPv6)', url: 'v6' },
			{ title: 'Manual (ports)', url: 'ports' },
		];

		return (
			<GridLayout 
				menuItems={ menuItems } 
				id="connectivity" 
				{...this.props}
			/>
		);
	},
});

export default General;
