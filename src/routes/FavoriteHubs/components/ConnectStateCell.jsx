import React from 'react';

import HubActions from 'actions/HubActions';
import { ConnectStateEnum } from 'constants/FavoriteHubConstants';

const ConnectStateCell = React.createClass({
	contextTypes: {
		routerLocation: React.PropTypes.object.isRequired,
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
	},

	getClickAction() {
		switch (this.props.cellData.id) {
			case ConnectStateEnum.CONNECTING:
			case ConnectStateEnum.CONNECTED:
				return () => HubActions.removeSession({ id: this.props.cellData.current_hub_id });
			case ConnectStateEnum.DISCONNECTED:
				return () => HubActions.createSession(this.context.routerLocation, this.props.rowData.hub_url);
		}
	},

	render: function () {
		return (
			<div className="connect-state">
				<i className={ 'icon large link ' + this.getIcon() } onClick={ this.getClickAction() }/>
				{ this.props.width > 120 ? this.props.cellData.str : null }
			</div>
		);
	}
});

export default ConnectStateCell;