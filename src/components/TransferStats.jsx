import React from 'react';
import Reflux from 'reflux';

import TransferStatsStore from 'stores/TransferStatsStore';
import ValueFormat from 'utils/ValueFormat';

const SpeedDisplay = React.createClass({
	render: function () {
		return (
			<div className="item">
				<i className={this.props.type + ' icon'}></i>
				<div className="content">
					<div className="header">{ ValueFormat.formatSpeed(this.props.speed) }</div>
				</div>
			</div>
		);
	}
});

const StatisticsBar = React.createClass({
	mixins: [ Reflux.connect(TransferStatsStore) ],
	render: function () {
		return (
			<div className={this.props.className}>
				<SpeedDisplay type="green download" speed={ this.state.statistics.speed_down }/>
				<SpeedDisplay type="red upload" speed={ this.state.statistics.speed_up }/>
			</div>
		);
	}
});

export default StatisticsBar;
