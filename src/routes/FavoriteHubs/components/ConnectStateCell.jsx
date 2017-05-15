import PropTypes from 'prop-types';
import React from 'react';

import HubActions from 'actions/HubActions';
import HubSessionStore from 'stores/HubSessionStore';

import { ConnectStateEnum } from 'constants/FavoriteHubConstants';


const ConnectStateCell = React.createClass({
	contextTypes: {
		routerLocation: PropTypes.object.isRequired,
	},

	getIcon() {
		switch (this.props.cellData.id) {
			case ConnectStateEnum.CONNECTING:
				return 'yellow remove';
			case ConnectStateEnum.CONNECTED:
				return 'grey remove';
			case ConnectStateEnum.DISCONNECTED:
				return 'green video play';
		}

		return '';
	},

	handleCreateSession() {
		HubActions.createSession(this.context.routerLocation, this.props.rowDataGetter().hub_url, HubSessionStore);
	},

	handleRemoveSession() {
		HubActions.removeSession({ id: this.props.cellData.current_hub_id });
	},

	getClickAction() {
		switch (this.props.cellData.id) {
			case ConnectStateEnum.CONNECTING:
			case ConnectStateEnum.CONNECTED: return this.handleRemoveSession;
			case ConnectStateEnum.DISCONNECTED:
			default: return this.handleCreateSession;
		}
	},

	render: function () {
		return (
			<div className="connect-state">
				<i className={ 'icon large link ' + this.getIcon() } onClick={ this.getClickAction() }/>
				{ this.props.width > 120 && this.props.cellData.str }
			</div>
		);
	}
});

export default ConnectStateCell;