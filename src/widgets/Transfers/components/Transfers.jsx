import React from 'react';

import { TimeSeries } from 'pondjs';

import { ListItem } from 'components/semantic/List';
import SpeedChart from './SpeedChart';

import StatisticsDecorator from 'decorators/StatisticsDecorator';
import ValueFormat from 'utils/ValueFormat';

import SetContainerSize from 'mixins/SetContainerSize';
import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';

import TransferConstants from 'constants/TransferConstants';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import '../style.css';


const IDLE_CHECK_PERIOD = 3000;
const MAX_EVENTS = 1800; // 30 minutes when transfers are running

const addSpeed = (points, down, up) => {
	const ret = [
		...points,
		[
			Date.now(),
			down,
			up,
		]
	];

	if (ret.length > MAX_EVENTS) {
		ret.shift();
	}

	return ret;
};

const Transfers = StatisticsDecorator(({ stats }) => (
	<div className="ui list info tiny">
		<ListItem header="Downloads" description={ stats.downloads }/>
		<ListItem header="Uploads" description={ stats.uploads }/>
		<div className="section-separator"/>
		<ListItem header="Downloaded" description={ ValueFormat.formatSize(stats.session_downloaded) }/>
		<ListItem header="Uploaded" description={ ValueFormat.formatSize(stats.session_uploaded) }/>
	</div>
), TransferConstants.TRANSFERRED_BYTES_URL, null, 10);


const TransferSpeed = React.createClass({
	mixins: [ SetContainerSize, SocketSubscriptionMixin(), PureRenderMixin ],
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
		this.idleInterval = setInterval(this.checkIdle, IDLE_CHECK_PERIOD);
	},

	componentWillUnmount() {
		clearInterval(this.idleInterval);
	},

	onSocketConnected(addSocketListener) {
		addSocketListener(TransferConstants.MODULE_URL, TransferConstants.STATISTICS, this.onStatsReceived);
	},

	checkIdle() {
		const { points } = this.state;
		if (points[points.length-1][0] + IDLE_CHECK_PERIOD - 200 <= Date.now()) {
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
		const noInfo = width < 300;

		return (
			<div className="transfers-container">
				{ false ? null : (
					<SpeedChart
						trafficSeries={ trafficSeries }
						maxDownload={ maxDownload }
						maxUpload={ maxUpload }
						width={ width }
						height={ height }
					/>
				) }
				{ noInfo ? null : (
					<Transfers
						stats={ stats }
					/>
				) }
			</div>
    );
	}
});

export default TransferSpeed;