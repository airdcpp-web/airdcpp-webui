import React from 'react';

import SocketService from 'services/SocketService';

// Decorator for statistics pages that fetch the content from API
export default function (Component, fetchUrl, unavailableMessage, fetchIntervalSeconds = 0) {
	const StatisticsPageDecorator = React.createClass({
		componentDidMount() {
			this.fetchStats();
		},

		componentWillUnmount() {
			clearTimeout(this.fetchTimeout);
		},

		fetchStats() {
			SocketService.get(fetchUrl).then(this.onStatsReceived).catch(error => console.error('Failed to fetch stats', error.message));
			if (fetchIntervalSeconds > 0) {
				this.fetchTimeout = setTimeout(this.fetchStats, fetchIntervalSeconds*1000);
			}
		},

		onStatsReceived(data) {
			this.setState({ stats: data });
		},

		getInitialState() {
			return {
				stats: null
			};
		},

		render() {
			const { stats } = this.state;
			if (stats === null) {
				return null;
			}

			if (stats === undefined) {
				return (
					<div>
						{ 'Statistics not available (' + unavailableMessage + ')' }
					</div>
				);
			}

			return <Component {...this.props} {...this.state}/>;
		},
	});

	return StatisticsPageDecorator;
}
