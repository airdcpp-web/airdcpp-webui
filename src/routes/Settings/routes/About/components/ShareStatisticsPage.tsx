'use strict';

import React from 'react';

import Moment from 'moment';
import { formatAverage, formatPercentage, formatSize } from 'utils/ValueFormat';

import ShareConstants from 'constants/ShareConstants';

import StatisticsDecorator, { StatisticsDecoratorChildProps } from 'decorators/StatisticsDecorator';

import { Row, Header } from 'components/semantic/Grid';


class ShareStatisticsPage extends React.Component<StatisticsDecoratorChildProps<any>> {
  render() {
    const { stats } = this.props;
    const averageFileAge = Moment.duration(stats.average_file_age * 1000).humanize();
    return (
      <div className="ui grid two column">
        <Row title="Total share size" text={ formatSize(stats.total_size) }/>
        <Row 
          title="Total files" 
          // tslint:disable-next-line:max-line-length
          text={ `${stats.total_file_count} (${formatPercentage(stats.unique_file_count, stats.total_file_count)} unique)` }
        />
        <Row title="Total directories" text={ stats.total_directory_count }/>
        <Row title="Average file age" text={ averageFileAge }/>
        <Row 
          title="Average files per directory" 
          text={ formatAverage(stats.total_file_count, stats.total_directory_count) }
        />

        <Header title="Incoming searches"/>
        <Row 
          title="Total searches" 
          text={ `${stats.total_searches} (${stats.total_searches_per_second.toFixed(1)} per second)` }
        />
        <Row title="TTH searches" text={ formatPercentage(stats.tth_searches, stats.total_searches) }/>
        <Row 
          title="Text searches" 
          // tslint:disable-next-line:max-line-length
          text={ `${stats.recursive_searches} (${stats.unfiltered_recursive_searches_per_second.toFixed(2)}  matched per second)` }
        />
        <Row 
          title="Filtered text searches" 
          text={ 
            formatPercentage(stats.filtered_searches, stats.recursive_searches) + 
      ' (' + 
      formatPercentage(stats.recursive_searches_responded, stats.recursive_searches - stats.filtered_searches) + 
      ' of the matched ones returned results)' 
          }
        />
        <Row 
          title="Average text search tokens (non-filtered)" 
          // tslint:disable-next-line:max-line-length
          text={ `${stats.average_search_token_count.toFixed(1)} (${stats.average_search_token_length.toFixed(1)} bytes per token)` }
        />
        <Row title="Average matching time per text search" text={ `${stats.average_match_ms} ms` }/>
      </div>
    );
  }
}

export default StatisticsDecorator(ShareStatisticsPage, ShareConstants.STATS_URL, 'No files shared', 60);