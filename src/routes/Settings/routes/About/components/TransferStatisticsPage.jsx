'use strict';

import React from 'react';

import LoginStore from 'stores/LoginStore';
import TransferStatsStore from 'stores/TransferStatsStore';

import Format from 'utils/Format';

import { Row, Header } from './Grid';

const TransferStatisticsPage = React.createClass({
	render() {
		const transferStats = TransferStatsStore.getState().statistics;

		const totalUp = transferStats.session_up + LoginStore.systemInfo.start_total_uploaded;
		const totalDown = transferStats.session_down + LoginStore.systemInfo.start_total_downloaded;

		return (
				<div className="about-page">
					<div className="ui grid two column about-grid">
						<Row title="Total downloaded" text={Format.formatSize(totalDown)}/>
						<Row title="Total uploaded" text={Format.formatSize(totalUp)}/>
						<Header title="Session"/>
						<Row title="Session downloaded" text={Format.formatSize(transferStats.session_down)}/>
						<Row title="Session uploaded" text={Format.formatSize(transferStats.session_up)}/>
					</div>
				</div>
		);
	},
});

export default TransferStatisticsPage;
