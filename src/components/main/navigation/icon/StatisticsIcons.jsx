import React from 'react';
import classNames from 'classnames';

import DataProviderDecorator from 'decorators/DataProviderDecorator';
import ValueFormat from 'utils/ValueFormat';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import HashConstants from 'constants/HashConstants';
import TransferConstants from 'constants/TransferConstants';
import IconConstants from 'constants/IconConstants';


const StatisticsIcon = ({ icon, bytes, formatter }) => {
	if (!bytes) {
		return null;
	}

	return (
		<div className="item">
			<i className={ icon + ' icon'}/>
			<div className="content">
				<div className="header">
					{ formatter(bytes) }
				</div>
			</div>
		</div>
	);
};

const StatisticsBar = React.createClass({
	mixins: [ PureRenderMixin ],
	render: function () {
		const { stats, className } = this.props;
		return (
			<div 
				className={ classNames(
					'ui centered inverted mini list statistics-icons', 
					className
				) }
			>
				<StatisticsIcon 
					icon={ IconConstants.DOWNLOAD }
					bytes={ stats.speed_down }
					formatter={ ValueFormat.formatSpeed }
				/>
				<StatisticsIcon 
					icon={ IconConstants.UPLOAD }
					bytes={ stats.speed_up }
					formatter={ ValueFormat.formatSpeed }
				/>
				<StatisticsIcon 
					icon={ IconConstants.HASH }
					bytes={ stats.hash_speed }
					formatter={ ValueFormat.formatSpeed }
				/>
				<StatisticsIcon 
					icon={ IconConstants.QUEUE }
					bytes={ stats.queued_bytes }
					formatter={ ValueFormat.formatSize }
				/>
			</div>
		);
	}
});

export default DataProviderDecorator(StatisticsBar, {
	urls: {
		stats: TransferConstants.STATISTICS_URL,
	},
	onSocketConnected: (addSocketListener, { mergeData }) => {
		const mergeStats = stats => mergeData({
			stats,
		});

		addSocketListener(TransferConstants.MODULE_URL, TransferConstants.STATISTICS, mergeStats);
		addSocketListener(HashConstants.MODULE_URL, HashConstants.STATISTICS, mergeStats);
	},
	loaderText: null,
});
