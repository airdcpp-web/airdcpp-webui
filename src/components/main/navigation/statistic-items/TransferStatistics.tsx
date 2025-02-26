import * as React from 'react';

import { useFormatter } from '@/context/FormatterContext';

import IconConstants from '@/constants/IconConstants';
import TransferConstants from '@/constants/TransferConstants';

import * as API from '@/types/api';

import DataProviderDecorator from '@/decorators/DataProviderDecorator';
import { StatisticsRow } from './StatisticsRow';

interface TransferStatisticsProps {}

interface TransferStatisticsDataProps {
  transferStats: Pick<API.TransferStats, 'speed_down' | 'speed_up' | 'queued_bytes'>;
}

const TransferStatistics: React.FC<
  TransferStatisticsProps & TransferStatisticsDataProps
> = ({ transferStats }) => {
  const { formatSize, formatSpeed } = useFormatter();
  return (
    <>
      <StatisticsRow
        icon={IconConstants.DOWNLOAD}
        bytes={transferStats.speed_down}
        formatter={formatSpeed}
      />
      <StatisticsRow
        icon={IconConstants.UPLOAD}
        bytes={transferStats.speed_up}
        formatter={formatSpeed}
      />
      <StatisticsRow
        icon={IconConstants.QUEUE_COLORED}
        bytes={transferStats.queued_bytes}
        formatter={formatSize}
      />
    </>
  );
};

export default DataProviderDecorator<
  TransferStatisticsProps,
  TransferStatisticsDataProps
>(TransferStatistics, {
  urls: {
    transferStats: TransferConstants.STATISTICS_URL,
  },
  initialData: {
    transferStats: {
      speed_down: 0,
      speed_up: 0,
      queued_bytes: 0,
    },
  },
  onSocketConnected: (addSocketListener, { mergeData }) => {
    addSocketListener(
      TransferConstants.MODULE_URL,
      TransferConstants.STATISTICS,
      (transferStats: API.TransferStats) => {
        mergeData({
          transferStats,
        });
      },
    );
  },
});
