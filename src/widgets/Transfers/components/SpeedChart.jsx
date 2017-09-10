import React from 'react';

import { Charts, ChartContainer, ChartRow, YAxis, AreaChart, styler } from 'react-timeseries-charts';

import PureRenderMixin from 'react-addons-pure-render-mixin';
import { withContentRect } from 'react-measure';


const upDownStyler = styler([
  { 
    key: 'in',
    color: '#C8D5B8',
  }, {
    key: 'out', 
    color: 'lightcoral',
  }
]);

const SpeedChart = withContentRect('bounds')(React.createClass({
  mixins: [ PureRenderMixin ],
  render() {
    const { trafficSeries, maxDownload, maxUpload, measureRef, contentRect } = this.props;
    return (
      <div ref={ measureRef } className="graph">
        <ChartContainer 
          timeRange={ trafficSeries.timerange() } 
          width={ contentRect.bounds.width }
        >
          <ChartRow 
            height={ contentRect.bounds.height - 25 }
          >
            <Charts>
              <AreaChart
                axis="traffic"
                series={ trafficSeries }
                columns={{ up: [ 'in' ], down: [ 'out' ] }}
                style={ upDownStyler }
              />
            </Charts>
            <YAxis
              id="traffic"
              label="Traffic (bps)"
              min={ -maxUpload } max={ maxDownload }
              absolute={true}
              width="60"
              type="linear"
            />
          </ChartRow>
        </ChartContainer>
      </div>
    );
  }
}));

export default SpeedChart;