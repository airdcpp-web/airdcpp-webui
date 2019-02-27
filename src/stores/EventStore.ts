//@ts-ignore
import Reflux from 'reflux';

import { default as EventConstants, SeverityEnum } from 'constants/EventConstants';
import EventActions from 'actions/reflux/EventActions';

import { LogMessageUrgencies } from 'constants/UrgencyConstants';
import { toUrgencyMap } from 'utils/UrgencyUtils';

import SocketSubscriptionDecorator from './decorators/SocketSubscriptionDecorator';
import AccessConstants from 'constants/AccessConstants';
import { mergeCacheMessages, pushMessage, checkUnreadCacheInfo, checkSplice } from 'utils/MessageUtils';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { AddListener } from 'airdcpp-apisocket';


//type MessageCache = API.StatusMessage[];
type MessageCache = UI.MessageListItem[];


const toCacheMessage = (message: API.StatusMessage): UI.MessageListItem => {
  return {
    log_message: message,
  };
};

const Store = {
  _logMessages: undefined as MessageCache | undefined,
  _messageCacheInfo: undefined as API.StatusMessageCounts | undefined,
  _viewActive: false,
  _initialized: false,

  listenables: EventActions,
  init: function () {
    //this._logMessages = undefined;
    //this._messageCacheInfo = undefined;
    //this._viewActive = false;
    //this._initialized = false;
  },

  isInitialized() {
    return this._initialized;
  },

  getInitialState() {
    return this._logMessages;
  },

  onSetActive(active: boolean) {
    this._viewActive = active;
  },

  onFetchMessages() {
    this._initialized = true;
  },

  onFetchMessagesCompleted(messages: API.StatusMessage[]) {
    this._logMessages = mergeCacheMessages(messages.map(toCacheMessage), this._logMessages);
    (this as any).trigger(this._logMessages);
  },

  onFetchInfoCompleted(data: API.StatusMessageCounts) {
    this.onLogInfoReceived(data);
  },

  onLogMessage(data: API.StatusMessage) {
    if (data.severity === SeverityEnum.NOTIFY) {
      return;
    }

    this._logMessages = pushMessage(toCacheMessage(data), this._logMessages);
    (this as any).trigger(this._logMessages);
  },

  onLogInfoReceived(cacheInfoNew: API.StatusMessageCounts) {
    if (this._viewActive) {
      cacheInfoNew = checkUnreadCacheInfo(
        cacheInfoNew, 
        () => EventActions.setRead()
      ) as API.StatusMessageCounts;
    }

    this._logMessages = checkSplice(this._logMessages, cacheInfoNew.total);
    this._messageCacheInfo = cacheInfoNew;

    (this as any).trigger(this._logMessages);
  },

  getTotalUrgencies() {
    if (!this._messageCacheInfo) {
      return null;
    }

    return toUrgencyMap(this._messageCacheInfo.unread, LogMessageUrgencies);
  },

  getLogMessages() {
    return this._logMessages;
  },

  onSocketConnected(addSocketListener: AddListener) {
    const url = EventConstants.MODULE_URL;
    addSocketListener(url, EventConstants.MESSAGE, this.onLogMessage);
    addSocketListener(url, EventConstants.COUNTS, this.onLogInfoReceived);
  },

  onSocketDisconnected() {
    this._logMessages = undefined;
    this._initialized = false;
  },
};

type EventStore = typeof Store;

const EventStore: EventStore = SocketSubscriptionDecorator(Reflux.createStore(Store), AccessConstants.EVENTS_VIEW);

export default EventStore;
