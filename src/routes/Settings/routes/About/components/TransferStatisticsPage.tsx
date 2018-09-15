'use strict';

import React from 'react';

import { formatSize } from 'utils/ValueFormat';
import { Row, Header } from 'components/semantic/Grid';

import TransferConstants from 'constants/TransferConstants';
import StatisticsDecorator, { StatisticsDecoratorChildProps } from 'decorators/StatisticsDecorator';

class TransferStatisticsPage extends React.Component<StatisticsDecoratorChildProps<any>> {
  render() {
    const { stats } = this.props;

    const totalUp = stats.session_uploaded + stats.start_total_uploaded;
    const totalDown = stats.session_downloaded + stats.start_total_downloaded;

    return (
      <div className="ui grid two column">
        <Row title="Total downloaded" text={ formatSize(totalDown) }/>
        <Row title="Total uploaded" text={ formatSize(totalUp) }/>
        <Header title="Session"/>
        <Row title="Session downloaded" text={ formatSize(stats.session_downloaded) }/>
        <Row title="Session uploaded" text={ formatSize(stats.session_uploaded) }/>
      </div>
    );
  }
}

export default StatisticsDecorator(TransferStatisticsPage, TransferConstants.TRANSFERRED_BYTES_URL, null, 5);
