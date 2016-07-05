import React from 'react';

import Perf from 'react-addons-perf';
import BrowserUtils from 'utils/BrowserUtils';


const PerformanceTools = React.createClass({
	onClick: function (evt) {
		const nextRunning = !BrowserUtils.loadSessionProperty('perf_profiling');
		if (nextRunning) {
			Perf.start();
			console.log('Performance measurement started');
		} else {
			Perf.stop();

			const measurements = Perf.getLastMeasurements();
			Perf.printWasted(measurements);
		}

		BrowserUtils.saveSessionProperty('perf_profiling', nextRunning);
		this.forceUpdate();
	},

	render: function () {
		const color = BrowserUtils.loadSessionProperty('perf_profiling') ? 'blue' : 'grey';
		return <i className={ color + ' link large lab icon' } onClick={ this.onClick }></i>;
	}
});

export default PerformanceTools;