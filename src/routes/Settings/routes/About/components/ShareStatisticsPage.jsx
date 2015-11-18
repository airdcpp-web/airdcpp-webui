'use strict';

import React from 'react';

import Moment from 'moment';
import Format from 'utils/Format';

import { SHARE_STATS_URL } from 'constants/ShareConstants';

import StatisticsPageDecorator from '../decorators/StatisticsPageDecorator';

import { Row } from './Grid';

const ShareStatisticsPage = React.createClass({
	render() {
		const { stats } = this.props;
		const averageFileAge = Moment.duration(stats.average_file_age*1000).humanize();
		return (
			<div className="ui grid two column about-grid">
				<Row title="Total share size" text={Format.formatSize(stats.total_size)}/>
				<Row title="Total files" text={stats.total_file_count + ' (' + stats.unique_file_percentage.toFixed(2) + ' % unique)'}/>
				<Row title="Total directories" text={stats.total_directory_count}/>
				<Row title="Average file age" text={averageFileAge}/>
				<Row title="Average files per directory" text={stats.files_per_directory}/>
			</div>
		);
	},
});

export default StatisticsPageDecorator(ShareStatisticsPage, SHARE_STATS_URL, 'no files shared');