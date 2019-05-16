'use strict';

import React from 'react';

import Moment from 'moment';
import { formatAverage, formatPercentage, formatSize } from 'utils/ValueFormat';

import ShareConstants from 'constants/ShareConstants';

import StatisticsDecorator, { StatisticsDecoratorChildProps } from 'decorators/StatisticsDecorator';

import { Row, Header, Grid } from 'components/semantic/Grid';

//import * as UI from 'types/ui';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';


interface ShareStatisticsPageProps extends SettingSectionChildProps {

}

const ShareStatisticsPage: React.FC<ShareStatisticsPageProps & StatisticsDecoratorChildProps<any>> = (
  { stats, moduleT }
) => {
  const averageFileAge = Moment.duration(stats.average_file_age * 1000).humanize();
  const { translate, t } = moduleT;
  return (
    <Grid columns="two" stackable={ true }>
      <Row 
        title={ translate('Total share size') } 
        text={ formatSize(stats.total_size, moduleT.plainT) }
      />
      <Row 
        title={ translate('Total files') } 
        // tslint:disable-next-line:max-line-length
        text={ t(
          'totalFilesValue',
          {
            defaultValue: '{{totalCount}} ({{uniqueCount}} unique)',
            replace: {
              totalCount: stats.total_file_count,
              uniqueCount: formatPercentage(stats.unique_file_count, stats.total_file_count)
            }
          }
        ) }
      />
      <Row 
        title={ translate('Total directories') } 
        text={ stats.total_directory_count }
      />
      <Row 
        title={ translate('Average file age') } 
        text={ averageFileAge }
      />
      <Row 
        title={ translate('Average files per directory') } 
        text={ formatAverage(stats.total_file_count, stats.total_directory_count) }
      />

      <Header title={ translate('Incoming searches') }/>
      <Row 
        title={ translate('Total searches') } 
        text={ t(
          'searchesTotalValue',
          {
            defaultValue: '{{totalCount}} ({{perSecondCount}} per second)',
            replace: {
              totalCount: stats.total_searches,
              perSecondCount: stats.total_searches_per_second.toFixed(1)
            }
          }
        ) }
      />
      <Row 
        title={ translate('TTH searches') } 
        text={ formatPercentage(stats.tth_searches, stats.total_searches) }
      />
      <Row 
        title={ 'Text searches' } 
        // tslint:disable-next-line:max-line-length
        text={ t(
          'searchesPerSecondValue',
          {
            defaultValue: '{{totalCount}} ({{matchedCount}} matched per second)',
            replace: {
              totalCount: stats.recursive_searches,
              matchedCount: stats.unfiltered_recursive_searches_per_second.toFixed(2)
            }
          }
        ) }
      />
      <Row 
        title={ translate('Filtered text searches') } 
        text={ t(
          'searchesFilteredValue',
          {
            defaultValue: '{{filteredPercentage}} ({{resultPercentage}} of the matched ones returned results)',
            replace: {
              filteredPercentage: formatPercentage(stats.filtered_searches, stats.recursive_searches),
              resultPercentage: formatPercentage(
                stats.recursive_searches_responded, 
                stats.recursive_searches - stats.filtered_searches
              )
            }
          }
        ) }
      />
      <Row 
        title={ translate('Average text search tokens (non-filtered)') }
        // tslint:disable-next-line:max-line-length
        text={ t(
          'searchesAverageTokensValue',
          {
            defaultValue: '{{tokenCount}} ({{tokenLength}} bytes per token)',
            replace: {
              tokenCount: stats.average_search_token_count.toFixed(1),
              tokenLength: stats.average_search_token_length.toFixed(1)
            }
          }
        ) }
      />
      <Row 
        title={ translate('Average matching time per text search') } 
        text={ t(
          'searchesAverageMatchTimeValue',
          {
            defaultValue: '{{matchTime}} ms',
            replace: {
              matchTime: stats.average_match_ms
            }
          }
        ) }
      />
    </Grid>
  );
};

export default StatisticsDecorator(
  ShareStatisticsPage, 
  ShareConstants.STATS_URL, 
  (t, props) => props.moduleT.translate('No files shared'), 
  60
);