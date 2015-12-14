'use strict';

import React from 'react';
import GridLayout from 'routes/Settings/components/GridLayout';

const System = React.createClass({
	render() {
		const menuItems = [
			{ title: 'Users', url: 'users', noSave: true, fullWidth: true },
		];

		/*const advancedMenuItems = [
			{ title: 'Sharing options', url: 'sharing-options' },
			{ title: 'Hashing', url: 'hashing' },
		];*/

		return (
			<GridLayout 
				menuItems={ menuItems }
				id="system"
				icon="server"
				{...this.props}
			/>
		);
	},
});

export default System;
