import Reflux from 'reflux';

import { default as LogConstants } from 'constants/LogConstants';
import { LogActions } from 'actions/LogActions';

import { LogMessageUrgencies } from 'constants/UrgencyConstants';
import UrgencyUtils from 'utils/UrgencyUtils';

import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator';
import AccessConstants from 'constants/AccessConstants';


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
		if (this._logMessages.length > LogConstants.MAX_LOG_MESSAGES) {
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
		const url = LogConstants.LOG_MODULE_URL;
		addSocketListener(url, LogConstants.LOG_MESSAGE, this.onLogMessage);
		addSocketListener(url, LogConstants.LOG_READ, this.onLogRead);
		addSocketListener(url, LogConstants.LOG_CLEARED, this.onLogCleared);
	}
});

export default SocketSubscriptionDecorator(LogStore, AccessConstants.EVENTS);
