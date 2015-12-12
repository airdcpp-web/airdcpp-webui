'use strict';

import React from 'react';

import Moment from 'moment';

import { Row } from './Grid';

import SystemConstants from 'constants/SystemConstants';
import StatisticsPageDecorator from '../decorators/StatisticsPageDecorator';
import ValueFormat from 'utils/ValueFormat';


const AboutPage = React.createClass({
	render() {
		const { stats } = this.props;

		const buildDate = Moment(new Date(JSON.parse(UI_BUILD_DATE))).format('LLL');

		return (
				<div className="about-page">
					<div className="ui grid two column about-grid">
						<Row title="Application version" text={stats.client_version}/>
						<Row title="Web UI version" text={UI_VERSION}/>
						<Row title="Web UI build date" text={buildDate}/>
						<Row title="Started" text={ValueFormat.formatRelativeTime(stats.client_started)}/>
						<Row title="Active sessions" text={stats.active_sessions}/>
					</div>
				</div>
		);
	},
});

export default StatisticsPageDecorator(AboutPage, SystemConstants.SYSTEM_STATS_URL, null, 5);
