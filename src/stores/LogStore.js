import Reflux from 'reflux';

import { LOG_MODULE_URL, MAX_LOG_MESSAGES, LOG_MESSAGE, LOG_READ, LOG_CLEARED, SeverityEnum } from 'constants/LogConstants';
import { LogActions } from 'actions/LogActions';

import { LogMessageUrgencies } from 'constants/UrgencyConstants';
import UrgencyUtils from 'utils/UrgencyUtils';

import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator';

const LogStore = Reflux.createStore({
	listenables: LogActions,
	init: function () {
		this._logMessages = [];
	},

	getInitialState: function () {
		return this._logMessages;
	},

	onFetchMessagesCompleted: function (data) {
		this._logMessages = data;
		this.trigger(this._logMessages);
	},

	onFetchMessagesFailed: function (error) {
	},

	onLogMessage: function (data) {
		this._logMessages.push(data);
		if (this._logMessages.length > MAX_LOG_MESSAGES) {
			this._logMessages.shift();
		}

		this.trigger(this._logMessages);
	},

	onLogCleared: function (data) {
		this._logMessages = [];
		this.trigger(this._logMessages);
	},

	onLogRead: function (data) {
		this._logMessages = this._logMessages.map(message => 
			Object.assign({}, message, { is_read: true } )
		);
		
		this.trigger(this._logMessages);
	},

	getTotalUrgencies() {
		return UrgencyUtils.getMessageUrgencies(this._logMessages, LogMessageUrgencies, 'severity');
	},

	get logMessages() {
		return this._logMessages;
	},

	onSocketConnected(addSocketListener) {
		addSocketListener(LOG_MODULE_URL, LOG_MESSAGE, this.onLogMessage);
		addSocketListener(LOG_MODULE_URL, LOG_READ, this.onLogRead);
		addSocketListener(LOG_MODULE_URL, LOG_CLEARED, this.onLogCleared);
	}
});

export default SocketSubscriptionDecorator(LogStore);
