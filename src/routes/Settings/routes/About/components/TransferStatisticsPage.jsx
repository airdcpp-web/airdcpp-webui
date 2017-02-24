'use strict';

import React from 'react';

import ValueFormat from 'utils/ValueFormat';
import { Row, Header } from './Grid';

import TransferConstants from 'constants/TransferConstants';
import StatisticsDecorator from 'decorators/StatisticsDecorator';

const TransferStatisticsPage = React.createClass({
	render() {
		const { stats } = this.props;

		const totalUp = stats.session_uploaded + stats.start_total_uploaded;
		const totalDown = stats.session_downloaded + stats.start_total_downloaded;

		return (
			<div className="ui grid two column">
				<Row title="Total downloaded" text={ ValueFormat.formatSize(totalDown) }/>
				<Row title="Total uploaded" text={ ValueFormat.formatSize(totalUp) }/>
				<Header title="Session"/>
				<Row title="Session downloaded" text={ ValueFormat.formatSize(stats.session_downloaded) }/>
				<Row title="Session uploaded" text={ ValueFormat.formatSize(stats.session_uploaded) }/>
			</div>
		);
	},
});

export default StatisticsDecorator(TransferStatisticsPage, TransferConstants.TRANSFERRED_BYTES_URL, null, 5);
