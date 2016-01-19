import React from 'react';

import { default as SystemConstants, AwayEnum } from 'constants/SystemConstants';
import SocketService from 'services/SocketService';
import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';

import NotificationActions from 'actions/NotificationActions';


const AwayIcon = React.createClass({
	mixins: [ SocketSubscriptionMixin() ],

	onSocketConnected(addSocketListener) {
		const url = SystemConstants.MODULE_URL;
		addSocketListener(url, SystemConstants.AWAY_STATE, this.onModeReceived);
	},

	getInitialState() {
		return {
			away: undefined,
		};
	},

	onModeReceived(data) {
		this.setState({ away: data.state });
	},

	componentDidMount() {
		SocketService.get(SystemConstants.MODULE_URL + '/away')
			.then(this.onModeReceived)
			.catch(error => console.error('Failed to fetch away state', error.message));
	},

	onAwaySet(away) {
		NotificationActions.info({ 
			title: away ? 'Away mode was enabled' : 'Away mode was disabled',
			uid: 'away',
		});
	},

	isAway() {
		return this.state.away !== AwayEnum.AWAY_OFF;
	},

	onClick: function (evt) {
		const newAway = !this.isAway();
		SocketService.post(SystemConstants.MODULE_URL + '/away', { 
			away: newAway,
		})
			.then(_ => this.onAwaySet(newAway))
			.catch(error => console.error('Failed to set away state', error.message));
	},

	render: function () {
		const iconColor = this.isAway() ? 'yellow' : 'grey';
		return <i className={ iconColor + ' away-state link large wait icon' } onClick={ this.onClick }></i>;
	}
});

export default AwayIcon;