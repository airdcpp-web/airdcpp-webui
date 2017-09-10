import React from 'react';

import Perf from 'react-addons-perf';
import BrowserUtils from 'utils/BrowserUtils';


class PerformanceTools extends React.Component {
  onClick = (evt) => {
    const nextRunning = !BrowserUtils.loadSessionProperty('perf_profiling');
    if (nextRunning) {
      Perf.start();
      console.log('Performance measurement started');
    } else {
      Perf.stop();

      const measurements = Perf.getLastMeasurements();
      Perf.printInclusive(measurements);
      Perf.printExclusive(measurements);
      Perf.printWasted(measurements);
      //Perf.printOperations(measurements);
    }

    BrowserUtils.saveSessionProperty('perf_profiling', nextRunning);
    this.forceUpdate();
  };

  render() {
    const color = BrowserUtils.loadSessionProperty('perf_profiling') ? 'blue' : 'grey';
    return <i className={ color + ' link large lab icon' } onClick={ this.onClick }/>;
  }
}

export default PerformanceTools;