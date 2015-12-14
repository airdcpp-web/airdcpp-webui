'use strict';

import React from 'react';
import GridLayout from 'routes/Settings/components/GridLayout';

const View = React.createClass({
	render() {
		const menuItems = [
			{ title: 'Histories', url: 'histories' },
			//{ title: 'Usage profile', url: 'profile' }
		];

		return (
			<GridLayout 
				menuItems={ menuItems } 
				id="view"
				icon="server"
				{...this.props}
			/>
		);
	},
});

export default View;
