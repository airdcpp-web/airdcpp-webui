'use strict';

import React from 'react';

import Format from 'utils/Format';

import { HUB_STATS_URL } from 'constants/HubConstants';
import SocketService from 'services/SocketService';
import OfflineHubMessageDecorator from 'decorators/OfflineHubMessageDecorator';

import { Row, Header } from './Grid';

const HubStatisticsPage = React.createClass({
	componentDidMount() {
		SocketService.get(HUB_STATS_URL).then(this.onStatsReceived).catch(error => console.error('Failed to fetch hub stats', error.message));
	},

	onStatsReceived(data) {
		this.setState({ stats: data });
	},

	getInitialState() {
		return {
			stats: undefined
		};
	},

	formatClient(client) {
		return (
			<Row
				title={client.name}
				text={client.count + ' (' + client.percentage.toFixed(2) + ' %)' }
			/>
		);
	},

	render() {
		const { stats } = this.state;
		if (stats === undefined) {
			return null;
		}

		return (
			<OfflineHubMessageDecorator offlineMessage="Statistics not available">
				<div className="ui grid two column about-grid">
					<Row title="Total users" text={stats.total_users}/>
					<Row title="Unique users" text={stats.unique_users + ' (' + stats.unique_user_percentage.toFixed(2) + ' %)'}/>
					<Row title="Total share" text={Format.formatSize(stats.total_share)}/>
					<Row title="Average share per user" text={Format.formatSize(stats.share_per_user)}/>
					<Header title="Clients"/>
					{stats.clients.map(this.formatClient)}
				</div>
			</OfflineHubMessageDecorator>
		);
	},
});

export default HubStatisticsPage;