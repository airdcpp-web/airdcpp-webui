import React from 'react';

import { Charts, ChartContainer, ChartRow, YAxis, AreaChart } from 'react-timeseries-charts';
import { TimeSeries, TimeRange } from 'pondjs';

import SetContainerSize from 'mixins/SetContainerSize';
import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';

import TransferConstants from 'constants/TransferConstants';


const addSpeed = (points, down, up) => [
	...points,
	[
		Date.now(),
		down,
		-up,
	]
];

const TransferSpeed = React.createClass({
	mixins: [ SetContainerSize, SocketSubscriptionMixin() ],
	propTypes: {
		/**
		 * Current widget settings
		 */
		//settings: React.PropTypes.object.isRequired,
	},

	getInitialState() {
		return {
			points: [
				[
					Date.now(),
					0,
					0,
				]
			],
			maxDownload: 0,
			maxUpload: 0,
		};
	},

	componentDidMount() {
		// Add zero values when there is no traffic
		this.idleInterval = setInterval(this.checkIdle, 1000);
	},

	componentWillUnmount() {
		clearInterval(this.idleInterval);
	},

	onSocketConnected(addSocketListener) {
		addSocketListener(TransferConstants.MODULE_URL, TransferConstants.STATISTICS, this.onStatsReceived);
	},

	checkIdle() {
		const { points } = this.state;
		if (points[points.length-1][0] + 1000 <= Date.now()) {
			this.setState({
				points: addSpeed(points, 0, 0),
			});
		}
	},

	onStatsReceived(data) {
		this.setState({
			points: addSpeed(this.state.points, data.speed_down, data.speed_up),
			maxDownload: Math.max(data.speed_down, this.state.maxDownload),
			maxUpload: Math.max(data.speed_up, this.state.maxUpload),
		});
	},

	render() {
		const data = {
			name: 'traffic',
			columns: [ 'time', 'in', 'out' ],
			points: this.state.points,
		};

		const trafficSeries = new TimeSeries(data);

		return (
			<div>
			<ChartContainer timeRange={ trafficSeries.timerange() } width={ Math.max(this.state.width - 30, 0) }>
				<ChartRow height={ Math.max(this.state.height - 50, 0) }>
					<Charts>
					<AreaChart
						axis="traffic"
						series={ trafficSeries }
						columns={{ up: [ 'in' ], down: [ 'out' ] }}
					/>
					</Charts>
					<YAxis
						id="traffic"
						label="Traffic (bps)"
						min={ -this.state.maxUpload } max={ this.state.maxDownload }
						absolute={true}
						width="60"
						type="linear"
					/>
				</ChartRow>
			</ChartContainer>
			</div>
    );
	}
});

export default {
	id: 'transfer-speed',
	component: TransferSpeed,
	name: 'Transfer speed',
	icon: 'exchange',
	size: {
		w: 7,
		h: 5,
		minW: 2,
		minH: 3,
	},
};