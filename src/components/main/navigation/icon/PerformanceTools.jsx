import React from 'react';

import Perf from 'react-addons-perf';

const PerformanceTools = React.createClass({
	getInitialState() {
		return {
			running: false
		};
	},

	onClick: function (evt) {
		const nextRunning = !this.state.running;
		if (nextRunning) {
			Perf.start();
			console.log('Performance measurement started');
		} else {
			Perf.stop();

			const measurements = Perf.getLastMeasurements();
			Perf.printWasted(measurements);
		}

		this.setState({ running: nextRunning });
	},

	render: function () {
		const color = this.state.running ? 'blue' : 'grey';
		return <i className={ color + ' link large lab icon' } onClick={ this.onClick }></i>;
	}
});

export default PerformanceTools;