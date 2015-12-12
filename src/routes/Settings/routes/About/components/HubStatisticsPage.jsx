'use strict';

import React from 'react';

import ValueFormat from 'utils/ValueFormat';

import HubConstants from 'constants/HubConstants';

import StatisticsPageDecorator from '../decorators/StatisticsPageDecorator';

import { Row, Header } from './Grid';

const HubStatisticsPage = React.createClass({
	formatClient(client) {
		return (
			<Row
				key={client.name}
				title={client.name}
				text={client.count + ' (' + client.percentage.toFixed(2) + ' %)' }
			/>
		);
	},

	render() {
		const { stats } = this.props;
		return (
			<div className="ui grid two column about-grid">
				<Row title="Total users" text={stats.total_users}/>
				<Row title="Unique users" text={stats.unique_users + ' (' + stats.unique_user_percentage.toFixed(2) + ' %)'}/>
				<Row title="Total share" text={ValueFormat.formatSize(stats.total_share)}/>
				<Row title="Average share per user" text={ValueFormat.formatSize(stats.share_per_user)}/>
				<Header title="Clients"/>
				{stats.clients.map(this.formatClient)}
			</div>
		);
	},
});

export default StatisticsPageDecorator(HubStatisticsPage, HubConstants.HUB_STATS_URL, 'no hubs online', 10);