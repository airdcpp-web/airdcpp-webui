import React from 'react';

import StatisticsDecorator from 'decorators/StatisticsDecorator';

import WidgetDropdown from './WidgetDropdown';

import SystemConstants from 'constants/SystemConstants';

import { ListItem } from 'components/semantic/List';
import ValueFormat from 'utils/ValueFormat';

import LoginStore from 'stores/LoginStore';

import '../style.css';


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