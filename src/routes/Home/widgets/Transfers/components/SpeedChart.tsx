import { memo, useMemo } from 'react';

import * as UI from '@/types/ui';
import { useFormatter } from '@/context/FormatterContext';
import { useAppStoreProperty } from '@/context/AppStoreContext';

export type TrafficSeries = Array<number[]>;

export interface SpeedChartProps extends Pick<UI.WidgetProps, 'widgetT'> {
  maxUpload: number;
  maxDownload: number;
  trafficSeries: any;
}

import ApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import useMeasure from 'react-use-measure';

const SpeedChart: React.FC<SpeedChartProps> = ({
  trafficSeries,
  maxDownload,
  maxUpload,
}) => {
  const { formatSpeed, formatDateTime } = useFormatter();
  const darkMode = useAppStoreProperty(
    (state) => state.settings.settings.dark_mode === true,
  );
  const options = useMemo<ApexOptions>(
    () => ({
      chart: {
        id: 'area-datetime',
        foreColor: darkMode ? '#f0f0f0' : undefined,
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
        width: 1,
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        enabled: true,
        theme: darkMode ? 'dark' : 'light',
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
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: darkMode ? '#f0f0f0' : undefined,
          },
          formatter: (value) => {
            return formatSpeed(Math.abs(value));
          },
        },
        max: maxDownload + maxDownload / 10,
        min: -maxUpload - maxUpload / 10,
        tickAmount: 4,
        stepSize: 1000000,
        opposite: true,
      },
    }),
    [maxUpload, maxDownload, darkMode],
  );

  const series: ApexOptions['series'] = [
    {
      name: 'Download',
      color: '#0ea432',
      data: trafficSeries.map((point: number[]) => ({
        y: point[1],
        x: point[0],
      })),
    },
    {
      name: 'Upload',
      color: '#b21e1e',
      data: trafficSeries.map((point: number[]) => ({
        y: -point[2],
        x: point[0],
      })),
    },
  ];

  const [measureRef, bounds] = useMeasure({
    debounce: 100,
  });
  return (
    <div ref={measureRef} className="graph">
      <ApexChart
        options={options}
        series={series}
        type="area"
        width={bounds?.width}
        height={bounds?.height}
      />
    </div>
  );
};

export default memo(SpeedChart);
