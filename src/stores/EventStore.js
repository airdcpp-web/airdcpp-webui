import Reflux from 'reflux';

import { default as EventConstants, SeverityEnum } from 'constants/EventConstants';
import { EventActions } from 'actions/EventActions';

import { LogMessageUrgencies } from 'constants/UrgencyConstants';
import UrgencyUtils from 'utils/UrgencyUtils';

import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator';
import AccessConstants from 'constants/AccessConstants';
import MessageUtils from 'utils/MessageUtils';


const EventStore = Reflux.createStore({
	listenables: EventActions,
	init: function () {
		this._logMessages = undefined;
		this._messageCacheInfo = undefined;
		this._viewActive = false;
		this._initialized = false;
	},

	isInitialized() {
		return this._initialized;
	},

	getInitialState() {
		return this._logMessages;
	},

	onSetActive(active) {
		this._viewActive = active;
	},

	onFetchMessages() {
		this._initialized = true;
	},

	onFetchMessagesCompleted(cacheMessages) {
		this._logMessages = MessageUtils.mergeCacheMessages(cacheMessages, this._logMessages);;
		this.trigger(this._logMessages);
	},

	onFetchInfoCompleted(data) {
		this.onLogInfoReceived(data);
	},

	onLogMessage(data) {
		if (data.severity === SeverityEnum.NOTIFY) {
			return;
		}

		this._logMessages = MessageUtils.pushMessage(data, this._logMessages);
		this.trigger(this._logMessages);
	},

	onLogInfoReceived(cacheInfoNew) {
		if (this._viewActive) {
			cacheInfoNew = MessageUtils.checkUnread(cacheInfoNew, EventActions);
		}

		this._logMessages = MessageUtils.checkSplice(this._logMessages, cacheInfoNew.total);
		this._messageCacheInfo = cacheInfoNew;

		this.trigger(this._logMessages);
	},

	getTotalUrgencies() {
		if (!this._messageCacheInfo) {
			return null;
		}

		return UrgencyUtils.toUrgencyMap(this._messageCacheInfo.unread, LogMessageUrgencies);
	},

	get logMessages() {
		return this._logMessages;
	},

	onSocketConnected(addSocketListener) {
		const url = EventConstants.MODULE_URL;
		addSocketListener(url, EventConstants.MESSAGE, this.onLogMessage);
		addSocketListener(url, EventConstants.COUNTS, this.onLogInfoReceived);
	},

	onSocketDisconnected() {
		this._logMessages = undefined;
		this._initialized = false;
	},
});

export default SocketSubscriptionDecorator(EventStore, AccessConstants.EVENTS_VIEW);
