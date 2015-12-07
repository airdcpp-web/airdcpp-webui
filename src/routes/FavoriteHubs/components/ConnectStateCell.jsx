import React from 'react';

import HubActions from 'actions/HubActions';
import { StateEnum } from 'constants/FavoriteHubConstants';

const ConnectStateCell = React.createClass({
	getIcon() {
		switch (this.props.cellData.id) {
			case StateEnum.STATE_CONNECTING:
				return 'yellow remove';
			case StateEnum.STATE_CONNECTED:
				return 'grey remove';
			case StateEnum.STATE_DISCONNECTED:
				return 'green video play';
		}
	},

	getClickAction() {
		switch (this.props.cellData.id) {
			case StateEnum.STATE_CONNECTING:
			case StateEnum.STATE_CONNECTED:
				return () => HubActions.removeSession(this.props.cellData.current_hub_id);
			case StateEnum.STATE_DISCONNECTED:
				return () => HubActions.createSession(this.props.location, this.props.rowData.hub_url);
		}
	},

	render: function () {
		return (
			<div>
				<i className={ 'icon large link ' + this.getIcon() } onClick={ this.getClickAction() }/>
				{ this.props.width > 100 ? this.props.cellData.str : null }
			</div>
		);
	}
});

export default ConnectStateCell;