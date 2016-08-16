import React from 'react';

import { Charts, ChartContainer, ChartRow, YAxis, AreaChart } from 'react-timeseries-charts';
import { TimeSeries, TimeRange } from 'pondjs';

import SetContainerSize from 'mixins/SetContainerSize';
import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';

import TransferConstants from 'constants/TransferConstants';

import './style.css';


const addSpeed = (points, down, up) => [
	...points,
	[
		Date.now(),
		down,
		-up,
	]
];

const SpeedChart = ({ trafficSeries, maxDownload, maxUpload, width, height }) => (
	<ChartContainer timeRange={ trafficSeries.timerange() } width={ Math.max(width - 120, 0) }>
		<ChartRow height={ Math.max(height - 50, 0) }>
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
				min={ -maxUpload } max={ maxDownload }
				absolute={true}
				width="60"
				type="linear"
			/>
		</ChartRow>
	</ChartContainer>
);

const TransferItem = ({ header, description }) => (
	<div className="item">
		<div className="header">{ header }</div>
		{ description }
	</div>
);

const Transfers = ({ stats }) => (
	<div className="ui list tiny extra content">
		<TransferItem header="Downloads" description={ stats.downloads }/>
		<TransferItem header="Uploads" description={ stats.uploads }/>
		<TransferItem header="Running bundles" description={ stats.download_bundles }/>
	</div>
);

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
			stats: {
				downloads: 0,
				uploads: 0,
				download_bundles: 0,
			}
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

	onStatsReceived(stats) {
		this.setState({
			points: addSpeed(this.state.points, stats.speed_down, stats.speed_up),
			maxDownload: Math.max(stats.speed_down, this.state.maxDownload),
			maxUpload: Math.max(stats.speed_up, this.state.maxUpload),
			stats,
		});
	},

	render() {
		const { points, maxDownload, maxUpload, width, height, stats } = this.state;
		const data = {
			name: 'traffic',
			columns: [ 'time', 'in', 'out' ],
			points,
		};

		const trafficSeries = new TimeSeries(data);

		return (
			<div className="transfers-container">
				<SpeedChart
					trafficSeries={ trafficSeries }
					maxDownload={ maxDownload }
					maxUpload={ maxUpload }
					width={ width }
					height={ height }
				/>
				<Transfers
					stats={ stats }
				/>
			</div>
    );
	}
});

export default {
	typeId: 'transfers',
	component: TransferSpeed,
	name: 'Transfers',
	icon: 'exchange',
	size: {
		w: 7,
		h: 5,
		minW: 2,
		minH: 3,
	},
};