import { PureComponent } from 'react';

//@ts-ignore
import { Charts, ChartContainer, ChartRow, YAxis, AreaChart, styler } from 'react-timeseries-charts';

import { withContentRect, MeasuredComponentProps } from 'react-measure';

import * as UI from 'types/ui';


const upDownStyler = styler([
  { 
    key: 'in',
    color: '#C8D5B8',
  }, {
    key: 'out', 
    color: 'lightcoral',
  }
]);

export interface SpeedChartProps extends Pick<UI.WidgetProps, 'widgetT'> {
  maxUpload: number;
  maxDownload: number;
  trafficSeries: any;
}

const SpeedChart = withContentRect('bounds')(
  // eslint-disable-next-line react/display-name
  class extends PureComponent<SpeedChartProps & MeasuredComponentProps> {
    render() {
      const { trafficSeries, maxDownload, maxUpload, measureRef, contentRect, widgetT } = this.props;
      const { bounds } = contentRect;
      return (
        <div ref={ measureRef } className="graph">
          <ChartContainer 
            timeRange={ trafficSeries.timerange() } 
            width={ bounds && bounds.width ? bounds.width : undefined }
          >
            <ChartRow 
              height={ bounds && bounds.height ? bounds.height : undefined }
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
                label={ widgetT.translate('Traffic (bps)') }
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