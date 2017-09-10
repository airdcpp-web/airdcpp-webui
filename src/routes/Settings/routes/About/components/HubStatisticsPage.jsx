'use strict';

import React from 'react';

import ValueFormat from 'utils/ValueFormat';

import HubConstants from 'constants/HubConstants';

import StatisticsDecorator from 'decorators/StatisticsDecorator';

import { Row, Header } from 'components/semantic/Grid';

const HubStatisticsPage = React.createClass({
  formatClient(uniqueUsers, client) {
    return (
      <Row
        key={ client.name }
        title={ client.name }
        text={ client.count + ' (' + ValueFormat.formatPercentage(client.count, uniqueUsers) + ')' }
      />
    );
  },

  render() {
    const { stats } = this.props;
    return (
      <div className="ui grid two column">
        <Row title="Total users" text={ stats.total_users }/>
        <Row title="Unique users" text={ stats.unique_users + ' (' + ValueFormat.formatPercentage(stats.unique_users, stats.total_users) + ')'}/>
        <Row title="Active users" text={ stats.active_users + ' (' + ValueFormat.formatPercentage(stats.active_users, stats.unique_users) + ')'}/>
        <Row title="Total share" text={ ValueFormat.formatSize(stats.total_share) }/>
        <Row title="Average share per user" text={ ValueFormat.formatSize(ValueFormat.formatAverage(stats.total_share, stats.unique_users)) }/>
        <Row title="Average ADC download speed" text={ ValueFormat.formatConnection(stats.adc_down_per_user) }/>
        <Row title="Average ADC upload speed" text={ ValueFormat.formatConnection(stats.adc_up_per_user) }/>
        <Header title="Clients"/>
        { stats.clients.map(this.formatClient.bind(this, stats.unique_users)) }
      </div>
    );
  },
});

export default StatisticsDecorator(HubStatisticsPage, HubConstants.STATS_URL, 'No hubs online', 10);