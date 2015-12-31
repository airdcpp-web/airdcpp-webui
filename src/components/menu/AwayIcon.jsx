import React from 'react';

import { default as SystemConstants, AwayEnum } from 'constants/SystemConstants';
import SocketService from 'services/SocketService';
import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';


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

	isAway() {
		return this.state.away !== AwayEnum.AWAY_OFF;
	},

	onClick: function (evt) {
		SocketService.post(SystemConstants.MODULE_URL + '/away', { 
			away: !this.isAway(),
		})
			.catch(error => console.error('Failed to set away state', error.message));
	},

	render: function () {
		//const touchIconColor = LocalSettingStore.touchModeEnabled ? 'blue' : 'grey';
		const iconColor = this.isAway() ? 'grey' : 'green';
		return <i className={ iconColor + ' away-state link large user icon' } onClick={ this.onClick }></i>;
	}
});

export default AwayIcon;