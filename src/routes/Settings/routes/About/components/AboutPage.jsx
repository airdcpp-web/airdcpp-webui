'use strict';

import React from 'react';

import Moment from 'moment';

import { Row } from 'components/semantic/Grid';

import LoginStore from 'stores/LoginStore';
import StatisticsDecorator from 'decorators/StatisticsDecorator';
import SystemConstants from 'constants/SystemConstants';
import { formatRelativeTime } from 'utils/ValueFormat';


class AboutPage extends React.Component {
  render() {
    const { stats } = this.props;
    const systemInfo = LoginStore.systemInfo;

    const buildDate = Moment(new Date(JSON.parse(UI_BUILD_DATE))).format('LLL');

    return (
      <div className="ui grid two column">
        <Row title="Application version" text={ systemInfo.client_version }/>
        <Row title="Web UI version" text={ UI_VERSION }/>
        <Row title="Web UI build date" text={ buildDate }/>
        <Row title="API version" text={ systemInfo.api_version }/>
        <Row title="API feature level" text={ systemInfo.api_feature_level }/>
        <Row title="Started" text={ formatRelativeTime(systemInfo.client_started) }/>
        <Row title="Active sessions" text={ stats.active_sessions }/>
        <Row title="Server threads" text={ stats.server_threads }/>
      </div>
    );
  }
}

export default StatisticsDecorator(AboutPage, SystemConstants.STATS_URL, null, 5);
