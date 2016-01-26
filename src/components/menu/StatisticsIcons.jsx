import React from 'react';

import ValueFormat from 'utils/ValueFormat';
import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import HashConstants from 'constants/HashConstants';
import TransferConstants from 'constants/TransferConstants';


const SpeedDisplay = ({ type, speed }) => {
	if (speed === 0) {
		return <span/>;
	}

	return (
		<div className="item">
			<i className={ type + ' icon'}></i>
			<div className="content">
				<div className="header">{ ValueFormat.formatSpeed(speed) }</div>
			</div>
		</div>
	);
};

const StatisticsBar = React.createClass({
	mixins: [ PureRenderMixin, SocketSubscriptionMixin() ],

	onSocketConnected(addSocketListener) {
		addSocketListener(TransferConstants.MODULE_URL, TransferConstants.STATISTICS, this.onStatsReceived);
		addSocketListener(HashConstants.MODULE_URL, HashConstants.STATISTICS, this.onStatsReceived);
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
		};
	},

	render: function () {
		return (
			<div className={this.props.className}>
				<SpeedDisplay type="green download" speed={ this.state.speed_down }/>
				<SpeedDisplay type="red upload" speed={ this.state.speed_up }/>
				<SpeedDisplay type="blue database" speed={ this.state.hash_speed }/>
			</div>
		);
	}
});

export default StatisticsBar;
