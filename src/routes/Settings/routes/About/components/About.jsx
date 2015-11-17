'use strict';

import React from 'react';
import GridLayout from 'routes/Settings/components/GridLayout';

const About = React.createClass({
	componentDidMount() {
		// Ensure that changing properties get updated
		this.interval = setInterval(() => this.forceUpdate(), 1000);
	},

	componentWillUnmount() {
		clearInterval(this.interval);
	},

	render() {
		const menuItems = [
			{ title: 'Application', url: 'application' },
			{ title: 'Transfer statistics', url: 'transfers' },
			{ title: 'Share statistics', url: 'share' },
			{ title: 'Hub statistics', url: 'hubs' },
		];

		return (
			<GridLayout 
				saveable={false}
				menuItems={ menuItems }
				id="about"
				icon="info"
				{...this.props}
			/>
		);
	},
});

export default About;
