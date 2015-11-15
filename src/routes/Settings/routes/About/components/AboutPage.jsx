'use strict';

import React from 'react';
import SettingPage from 'routes/Settings/components/SettingPage';

import LoginStore from 'stores/LoginStore';
import TransferStatsStore from 'stores/TransferStatsStore';

import Moment from 'moment';
import Format from 'utils/Format';

import { SHARE_STATS_URL } from 'constants/ShareConstants';
import SocketService from 'services/SocketService';

const Row = ({ title, text }) => (
	<div className="ui row">
		<div className="three wide column">
			<div className="ui tiny header">
			{ title }
			</div>
		</div>
		<div className="twelve wide column">
			{ text }
		</div>
	</div>
);

const Header = ({ title }) => (
	<div className="ui blue header">
		{ title }
	</div>
);

const ShareStats = React.createClass({
	componentDidMount() {
		SocketService.get(SHARE_STATS_URL).then(this.onStatsReceived).catch(error => console.error('Failed to fetch share stats', error.message));
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
		if (!stats) {
			return null;
		}

		const averageFileAge = Moment.duration(stats.average_file_age*1000).humanize();
		return (
			<div className="ui grid two column about-grid">
				<Header title="Share"/>
				<Row title="Total share size" text={Format.formatSize(stats.total_size)}/>
				<Row title="Total files" text={stats.total_file_count + ' (' + stats.unique_file_percentage.toFixed(2) + ' % unique)'}/>
				<Row title="Total directories" text={stats.total_directory_count}/>
				<Row title="Average file age" text={averageFileAge}/>
				<Row title="Average files per directory" text={stats.files_per_directory}/>
			</div>
		);
	},
});

const AboutPage = React.createClass({
	componentDidMount() {
		this.interval = setInterval(() => this.forceUpdate(), 1000);
	},

	componentWillUnmount() {
		clearInterval(this.interval);
	},

	render() {
		const uptime = Moment.unix(LoginStore.systemInfo.client_started).from(Moment());
		const buildDate = Moment(new Date(JSON.parse(UI_BUILD_DATE))).format('LLL');
		const transferStats = TransferStatsStore.getState().statistics;

		const totalUp = transferStats.session_up + LoginStore.systemInfo.start_total_uploaded;
		const totalDown = transferStats.session_down + LoginStore.systemInfo.start_total_downloaded;

		return (
			<SettingPage 
				sectionId="about" 
				title="About"
				icon="info"
				saveable={false}
				{...this.props}
			>
				<div className="about-page">
					<div className="ui grid two column about-grid">
						<Header title="System"/>
						<Row title="Application version" text={LoginStore.systemInfo.client_version}/>
						<Row title="UI version" text={UI_VERSION}/>
						<Row title="UI build date" text={buildDate}/>
						<Header title="Session"/>
						<Row title="Started" text={uptime}/>
						<Row title="Session downloaded" text={Format.formatSize(transferStats.session_down)}/>
						<Row title="Session uploaded" text={Format.formatSize(transferStats.session_up)}/>
						<Header title="All time"/>
						<Row title="Total downloaded" text={Format.formatSize(totalDown)}/>
						<Row title="Total uploaded" text={Format.formatSize(totalUp)}/>
					</div>
					<ShareStats/>
				</div>
			</SettingPage>
		);
	},
});

export default AboutPage;
