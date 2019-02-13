'use strict';

import React from 'react';

import { formatAverage, formatConnection, formatPercentage, formatSize } from 'utils/ValueFormat';

import HubConstants from 'constants/HubConstants';

import StatisticsDecorator, { StatisticsDecoratorChildProps } from 'decorators/StatisticsDecorator';

import { Row, Header } from 'components/semantic/Grid';
import { translate } from 'utils/TranslationUtils';

import * as UI from 'types/ui';


class HubStatisticsPage extends React.Component<StatisticsDecoratorChildProps<any>> {
  formatClient = (uniqueUsers: number, client: { name: string; count: number; }) => {
    return (
      <Row
        key={ client.name }
        title={ client.name }
        text={ client.count + ' (' + formatPercentage(client.count, uniqueUsers) + ')' }
      />
    );
  }

  render() {
    const { stats } = this.props;
    return (
      <div className="ui grid two column">
        <Row title="Total users" text={ stats.total_users }/>
        <Row 
          title="Unique users" 
          text={ `${stats.unique_users} (${formatPercentage(stats.unique_users, stats.total_users)})` }
        />
        <Row 
          title="Active users" 
          text={ `${stats.active_users} (${formatPercentage(stats.active_users, stats.unique_users)})` }
        />
        <Row title="Total share" text={ formatSize(stats.total_share) }/>
        <Row 
          title="Average share per user" 
          text={ formatSize(formatAverage(stats.total_share, stats.unique_users) as any as number) }
        />
        <Row title="Average ADC download speed" text={ formatConnection(stats.adc_down_per_user) }/>
        <Row title="Average ADC upload speed" text={ formatConnection(stats.adc_up_per_user) }/>
        <Header title="Clients"/>
        { stats.clients.map(this.formatClient.bind(this, stats.unique_users)) }
      </div>
    );
  }
}

export default StatisticsDecorator(
  HubStatisticsPage, 
  HubConstants.STATS_URL, 
  t => translate('No hubs online', t, UI.Modules.SETTINGS), 
  10
);