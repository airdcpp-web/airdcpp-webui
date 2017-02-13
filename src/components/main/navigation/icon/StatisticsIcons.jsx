import React from 'react';

import SocketService from 'services/SocketService';
import ValueFormat from 'utils/ValueFormat';
import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import AccessConstants from 'constants/AccessConstants';
import HashConstants from 'constants/HashConstants';
import IconConstants from 'constants/IconConstants';
import TransferConstants from 'constants/TransferConstants';


const StatisticsIcon = ({ icon, bytes, formatter }) => {
	if (bytes === 0) {
		return null;
	}

	return (
		<div className="item">
			<i className={ icon + ' icon'}/>
			<div className="content">
				<div className="header">{ formatter(bytes) }</div>
			</div>
		</div>
	);
};

const StatisticsBar = React.createClass({
	mixins: [ PureRenderMixin, SocketSubscriptionMixin() ],
	getDefaultProps() {
		return {
			className: '',
		};
	},

	onSocketConnected(addSocketListener) {
		addSocketListener(TransferConstants.MODULE_URL, TransferConstants.STATISTICS, this.onStatsReceived, null, AccessConstants.TRANSFERS);
		addSocketListener(HashConstants.MODULE_URL, HashConstants.STATISTICS, this.onStatsReceived, null, AccessConstants.SETTINGS_VIEW);
	},

	fetchStats() {
		SocketService.get(TransferConstants.STATISTICS_URL)
			.then(this.onStatsReceived)
			.catch(error => console.error('Failed to fetch transfer statistics', error.message));
	},

	componentDidMount() {
		this.fetchStats();
	},

	onStatsReceived(data) {
		const newState = Object.assign({}, this.state, data);
		this.setState(newState);
	},

	getInitialState() {
		return {
			speed_down: 0,
			speed_up: 0,
			hash_speed: 0,
			queued_bytes: 0,
		};
	},

	render: function () {
		return (
			<div className={ 'ui centered inverted mini list statistics-icons ' + this.props.className }>
				<StatisticsIcon 
					icon={ IconConstants.DOWNLOAD }
					bytes={ this.state.speed_down }
					formatter={ ValueFormat.formatSpeed }
				/>
				<StatisticsIcon 
					icon={ IconConstants.UPLOAD }
					bytes={ this.state.speed_up }
					formatter={ ValueFormat.formatSpeed }
				/>
				<StatisticsIcon 
					icon={ IconConstants.HASH }
					bytes={ this.state.hash_speed }
					formatter={ ValueFormat.formatSpeed }
				/>
				<StatisticsIcon 
					icon={ IconConstants.QUEUE }
					bytes={ this.state.queued_bytes }
					formatter={ ValueFormat.formatSize }
				/>
			</div>
		);
	}
});

export default StatisticsBar;
