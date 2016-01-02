import Reflux from 'reflux';

import { default as LogConstants } from 'constants/LogConstants';
import { LogActions } from 'actions/LogActions';

import { LogMessageUrgencies } from 'constants/UrgencyConstants';
import UrgencyUtils from 'utils/UrgencyUtils';

import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator';
import AccessConstants from 'constants/AccessConstants';
import MessageUtils from 'utils/MessageUtils';


const LogStore = Reflux.createStore({
	listenables: LogActions,
	init: function () {
		this._logMessages = null;
		this._info = null;
		this._active = false;
	},

	getInitialState: function () {
		return this._logMessages;
	},

	onSetActive(active) {
		this._active = active;
	},

	onFetchMessagesCompleted: function (data) {
		this._logMessages = data;
		this.trigger(this._logMessages);
	},

	onFetchInfoCompleted: function (data) {
		this.onLogInfo(data);
	},

	onLogMessage: function (data) {
		if (!this._info) {
			return;
		}

		this._logMessages = MessageUtils.handleMessage(data, this._logMessages, this._info.total_messages);

		if (this._logMessages) {
			this.trigger(this._logMessages);
		}
	},

	onLogInfo: function (newInfo) {
		if (this._active) {
			newInfo = MessageUtils.checkUnread(newInfo, LogActions);
		}

		// In case the log was cleared
		this._logMessages = MessageUtils.checkSplice(this._logMessages, newInfo.total_messages);

		this._info = newInfo;
		this.trigger(this._logMessages);
	},

	getTotalUrgencies() {
		if (!this._info) {
			return null;
		}

		return UrgencyUtils.toUrgencyMap(this._info.unread_messages, LogMessageUrgencies);
	},

	get logMessages() {
		return this._logMessages;
	},

	onSocketConnected(addSocketListener) {
		const url = LogConstants.MODULE_URL;
		addSocketListener(url, LogConstants.LOG_MESSAGE, this.onLogMessage);
		addSocketListener(url, LogConstants.LOG_INFO, this.onLogInfo);
	}
});

export default SocketSubscriptionDecorator(LogStore, AccessConstants.EVENTS);
