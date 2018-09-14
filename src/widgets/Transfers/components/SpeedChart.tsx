import React from 'react';

//@ts-ignore
import { Charts, ChartContainer, ChartRow, YAxis, AreaChart, styler } from 'react-timeseries-charts';

import { withContentRect, MeasuredComponentProps } from 'react-measure';


const upDownStyler = styler([
  { 
    key: 'in',
    color: '#C8D5B8',
  }, {
    key: 'out', 
    color: 'lightcoral',
  }
]);

export interface SpeedChartProps {
  maxUpload: number;
  maxDownload: number;
  trafficSeries: any;
}

const SpeedChart = withContentRect('bounds')(
  class extends React.PureComponent<SpeedChartProps & MeasuredComponentProps> {
    render() {
      const { trafficSeries, maxDownload, maxUpload, measureRef, contentRect } = this.props;
      return (
        <div ref={ measureRef } className="graph">
          <ChartContainer 
            timeRange={ trafficSeries.timerange() } 
            width={ contentRect.bounds!.width }
          >
            <ChartRow 
              height={ contentRect.bounds!.height - 25 }
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
                min={ -maxUpload } 
                max={ maxDownload }
                absolute={true}
                width="60"
                type="linear"
              />
            </ChartRow>
          </ChartContainer>
        </div>
      );
    }
  }
);

export default SpeedChart;