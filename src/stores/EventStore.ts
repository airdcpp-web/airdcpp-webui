//@ts-ignore
import Reflux from 'reflux';

import { default as EventConstants, SeverityEnum } from 'constants/EventConstants';
import EventActions from 'actions/reflux/EventActions';

import { LogMessageUrgencies } from 'constants/UrgencyConstants';
import { toUrgencyMap } from 'utils/UrgencyUtils';

import SocketSubscriptionDecorator from './decorators/SocketSubscriptionDecorator';
import AccessConstants from 'constants/AccessConstants';
import {
  mergeCacheMessages,
  pushMessage,
  checkUnreadCacheInfo,
  checkSplice,
} from 'utils/MessageUtils';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { AddListener } from 'airdcpp-apisocket';
import ActivityStore, { ActivityState } from './ActivityStore';

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

  scrollPosition: undefined as number | undefined,
  listenables: EventActions,
  init: function () {
    (this as any).listenTo(ActivityStore, this._activityStoreListener);
  },

  isInitialized() {
    return this._initialized;
  },

  getInitialState() {
    return this._logMessages;
  },

  getScrollData() {
    // console.log(`Getting scroll position ${this.scrollPosition} for events`);
    return this.scrollPosition;
  },

  setScrollData(data: number) {
    // console.log(`Setting scroll position ${data} for events`);
    this.scrollPosition = data;
  },

  onSetActive(active: boolean) {
    this._viewActive = active;
  },

  onFetchMessages() {
    this._initialized = true;
  },

  onFetchMessagesCompleted(messages: API.StatusMessage[]) {
    this._logMessages = mergeCacheMessages(
      messages.map(toCacheMessage),
      this._logMessages,
    );
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

  checkReadState(cacheInfoNew: API.StatusMessageCounts) {
    if (this._viewActive && ActivityStore.userActive) {
      cacheInfoNew = checkUnreadCacheInfo(cacheInfoNew, () =>
        EventActions.setRead(),
      ) as API.StatusMessageCounts;
    }

    return cacheInfoNew;
  },

  onLogInfoReceived(cacheInfoNew: API.StatusMessageCounts) {
    cacheInfoNew = this.checkReadState(cacheInfoNew);

    this._logMessages = checkSplice(this._logMessages, cacheInfoNew.total);
    this._messageCacheInfo = cacheInfoNew;

    (this as any).trigger(this._logMessages);
  },

  getTotalUrgencies() {
    if (!this._messageCacheInfo) {
      return {};
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

  _activityStoreListener(activityState: ActivityState) {
    if (this._messageCacheInfo) {
      this.checkReadState(this._messageCacheInfo);
    }
  },
};

type EventStore = typeof Store;

const EventStore: EventStore = SocketSubscriptionDecorator(
  Reflux.createStore(Store),
  AccessConstants.EVENTS_VIEW,
);

export default EventStore;
