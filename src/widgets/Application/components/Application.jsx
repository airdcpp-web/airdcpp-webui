import React from 'react';

import StatisticsDecorator from 'decorators/StatisticsDecorator';

import WidgetDropdown from './WidgetDropdown';

//import LinkConstants from 'constants/LinkConstants';
import SystemConstants from 'constants/SystemConstants';

import ValueFormat from 'utils/ValueFormat';

//import ExternalLink from 'components/ExternalLink';
import LoginStore from 'stores/LoginStore';

import '../style.css';


const ListItem = ({ header, description }) => (
	<div className="item">
		<div className="header">{ header }</div>
		{ description }
	</div>
);

const Transfers = StatisticsDecorator(({ stats }) => (
	<div className="ui list">
		<ListItem header="Logged in as" description={ LoginStore.user }/>
		<ListItem header="Client started" description={ ValueFormat.formatRelativeTime(stats.client_started) }/>
		{/*<TransferItem header="Client version" description={ stats.client_version }/>*/}
		<ListItem header="Active sessions" description={ stats.active_sessions }/>
	</div>
), SystemConstants.STATS_URL, 'Failed to fetch information', 10);

const Application = React.createClass({
	propTypes: {

	},

	render() {
		return (
			<div className="application-container">
				<Transfers
					stats={ this.props.stats }
				/>
				<WidgetDropdown
					componentId={ this.props.componentId }
				/>
			</div>
    );
	}
});

export default Application;