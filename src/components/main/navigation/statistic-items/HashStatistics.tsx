import * as React from 'react';

import { useFormatter } from '@/context/FormatterContext';

import HashConstants from '@/constants/HashConstants';
import IconConstants from '@/constants/IconConstants';

import * as API from '@/types/api';

import DataProviderDecorator from '@/decorators/DataProviderDecorator';
import { StatisticsRow } from './StatisticsRow';

interface HashStatisticsProps {
  // className?: string;
}

interface HashStatisticsDataProps {
  hashStats: Pick<API.HashStats, 'hash_speed' | 'hash_bytes_left'>;
}

const HashStatistics: React.FC<HashStatisticsProps & HashStatisticsDataProps> = ({
  // className,
  hashStats,
}) => {
  const { formatSpeed } = useFormatter();
  return (
    <StatisticsRow
      icon={IconConstants.HASH}
      bytes={hashStats.hash_speed}
      formatter={formatSpeed}
    />
  );
};

export default DataProviderDecorator<HashStatisticsProps, HashStatisticsDataProps>(
  HashStatistics,
  {
    urls: {
      hashStats: HashConstants.STATS_URL,
    },
    initialData: {
      hashStats: {
        hash_speed: 0,
        hash_bytes_left: 0,
      },
    },
    onSocketConnected: (addSocketListener, { mergeData }) => {
      addSocketListener(
        HashConstants.MODULE_URL,
        HashConstants.STATISTICS,
        (hashStats: API.HashStats) => {
          mergeData({
            hashStats,
          });
        },
      );
    },
  },
);
