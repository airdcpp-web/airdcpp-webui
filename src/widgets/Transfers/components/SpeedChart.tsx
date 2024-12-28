import Chart from 'react-apexcharts';

import Measure from 'react-measure';

import * as UI from 'types/ui';
import { memo, useMemo } from 'react';
import { ApexOptions } from 'apexcharts';
import { useFormatter } from 'context/FormatterContext';

export type TrafficSeries = Array<number[]>;

export interface SpeedChartProps extends Pick<UI.WidgetProps, 'widgetT'> {
  maxUpload: number;
  maxDownload: number;
  trafficSeries: any;
}

const SpeedChart: React.FC<SpeedChartProps> = ({
  trafficSeries,
  maxDownload,
  maxUpload,
  // widgetT,
}) => {
  const { formatSpeed, formatDateTime } = useFormatter();
  const options = useMemo<ApexOptions>(
    () => ({
      chart: {
        id: 'area-datetime',
        toolbar: {
          show: false,
        },
        animations: {
          enabled: false,
        },
      },
      legend: { show: false },
      stroke: {
        curve: 'smooth',
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        enabled: true,
      },
      xaxis: {
        type: 'datetime',
        labels: {
          show: false,
          formatter: (value, timestamp) => {
            return formatDateTime(timestamp! / 1000);
          },
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        // seriesName: widgetT.translate('Traffic (bps)'),
        labels: {
          formatter: (value) => {
            return formatSpeed(Math.abs(value));
          },
        },
        max: maxDownload + maxDownload / 10,
        min: -maxUpload - maxUpload / 10,
        tickAmount: 4,
        stepSize: 1000000,
        opposite: true,
        // forceNiceScale: true,
      },
    }),
    [maxUpload, maxDownload],
  );

  const series: ApexOptions['series'] = [
    {
      name: 'Download',
      color: '#C8D5B8',
      data: trafficSeries.map((point: number[]) => ({
        y: point[1],
        x: point[0],
      })),
    },
    {
      name: 'Upload',
      color: 'red',
      data: trafficSeries.map((point: number[]) => ({
        y: -point[2],
        x: point[0],
      })),
    },
  ];

  return (
    <Measure bounds={true}>
      {({ measureRef, contentRect: { bounds } }) => (
        <div ref={measureRef} className="graph">
          <Chart
            options={options}
            series={series}
            type="area"
            width={bounds && bounds.width ? bounds.width : undefined}
            height={bounds && bounds.height ? bounds.height : undefined}
          />
        </div>
      )}
    </Measure>
  );
};

export default memo(SpeedChart);
