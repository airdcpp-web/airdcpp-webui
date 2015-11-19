'use strict';

import React from 'react';

import Format from 'utils/Format';
import { Row, Header } from './Grid';

import { TRANSFER_STATS_URL } from 'constants/TransferConstants';
import StatisticsPageDecorator from '../decorators/StatisticsPageDecorator';

const TransferStatisticsPage = React.createClass({
	render() {
		const { stats } = this.props;

		const totalUp = stats.session_uploaded + stats.start_total_uploaded;
		const totalDown = stats.session_downloaded + stats.start_total_downloaded;

		return (
				<div className="about-page">
					<div className="ui grid two column about-grid">
						<Row title="Total downloaded" text={Format.formatSize(totalDown)}/>
						<Row title="Total uploaded" text={Format.formatSize(totalUp)}/>
						<Header title="Session"/>
						<Row title="Session downloaded" text={Format.formatSize(stats.session_downloaded)}/>
						<Row title="Session uploaded" text={Format.formatSize(stats.session_uploaded)}/>
					</div>
				</div>
		);
	},
});

export default StatisticsPageDecorator(TransferStatisticsPage, TRANSFER_STATS_URL, null, 5);
