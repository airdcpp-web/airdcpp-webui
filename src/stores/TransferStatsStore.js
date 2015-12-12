import Reflux from 'reflux';

import TransferConstants from 'constants/TransferConstants';

import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator';


const TransferStatsStore = Reflux.createStore({
	init: function () {
		this.getInitialState = this.getState;
		this._statistics = {
			speed_down: 0,
			speed_up: 0,
			session_down: 0,
			session_up: 0
		};
	},

	getState: function () {
		return {
			statistics: this._statistics
		};
	},

	onStatistics: function (data) {
		this._statistics = data;
		this.trigger(this.getState());
	},

	onSocketConnected(addSocketListener) {
		addSocketListener(TransferConstants.TRANSFER_MODULE_URL, TransferConstants.STATISTICS, this.onStatistics);
	}
});

export default SocketSubscriptionDecorator(TransferStatsStore)
;
