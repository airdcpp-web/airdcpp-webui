import Reflux from 'reflux';

import { default as EventConstants } from 'constants/EventConstants';
import { EventActions } from 'actions/EventActions';

import { LogMessageUrgencies } from 'constants/UrgencyConstants';
import UrgencyUtils from 'utils/UrgencyUtils';

import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator';
import AccessConstants from 'constants/AccessConstants';
import MessageUtils from 'utils/MessageUtils';


const EventStore = Reflux.createStore({
	listenables: EventActions,
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
		// If the socket was disconnected
		this._logMessages = null;
		
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
			newInfo = MessageUtils.checkUnread(newInfo, EventActions);
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
		const url = EventConstants.MODULE_URL;
		addSocketListener(url, EventConstants.MESSAGE, this.onLogMessage);
		addSocketListener(url, EventConstants.COUNTS, this.onLogInfo);
	}
});

export default SocketSubscriptionDecorator(EventStore, AccessConstants.EVENTS_VIEW);
