import * as API from '@/types/api';

import { MessageCounts, SessionItemBase, SessionType } from './sessions';
import { UrgencyCountMap } from './urgencies';
import { MessageListItem } from './messages';
import { APISocket } from '@/services/SocketService';
import { AuthenticatedSession } from './auth';
import { SubscriptionCallback } from 'airdcpp-apisocket';

export interface UnreadInfoStore {
  getTotalUrgencies: () => UrgencyCountMap | null;
}

export type AddSessionSliceSocketListener = (
  listenerName: string,
  callback: SubscriptionCallback,
) => Promise<void>;

export interface SessionInitData extends SessionStoreInitData {
  addSocketListener: AddSessionSliceSocketListener;
}

export type SessionReadHandler = (sessionItem: SessionItemBase) => void;

export interface SessionSlice<SessionT extends SessionType> extends UnreadInfoStore {
  readonly sessions: Array<SessionT> | null;
  readonly activeSessionId: API.IdType | null;

  init: (data: SessionT[]) => void;
  setActiveSession: (sessionItem: SessionT | null) => void;
  getItemUrgencies: (sessionItem: SessionT) => UrgencyCountMap | null;
  getSession: (id: API.IdType) => SessionT | undefined;

  createSession: (sessionItem: SessionT) => void;
  updateSession: (sessionItem: Partial<SessionT>, id: API.IdType) => void;
  removeSession: (sessionItem: SessionT) => void;

  setReadHandler: (handler: SessionReadHandler) => void;
}

export interface ScrollHandler {
  getScrollData: (id?: API.IdType) => number | undefined;
  setScrollData: (data: number | undefined, id?: API.IdType) => void;
}

export interface SessionScrollHandler extends ScrollHandler {
  onSessionRemoved: (data: SessionItemBase) => void;
}

export interface MessageSlice {
  messages: Map<API.IdType, MessageListItem[]>;
  initializedSession: Set<API.IdType>;

  onFetchMessages: (sessionItem: SessionItemBase) => void;
  onMessagesFetched: (
    sessionItem: SessionItemBase,
    cacheMessages: MessageListItem[],
  ) => void;
  addChatMessage: (data: API.Message, sessionId: API.IdType) => void;
  addStatusMessage: (data: API.Message, sessionId: API.IdType) => void;
  updateSession: (sessionItem: Partial<MessageCounts>, sessionId: API.IdType) => void;
  removeSession: (sessionItem: SessionItemBase) => void;

  isSessionInitialized: (sessionId: API.IdType) => boolean;
  scroll: SessionScrollHandler;
}

export interface HubSessionSlice {
  hasConnectedHubs: () => boolean;
  getSessionByUrl: (hubUrl: string) => API.Hub | undefined;
}

export interface ActivitySlice {
  away: API.AwayEnum;
  userActive: boolean;

  setUserActive: (active: boolean) => void;
  setAway: (away: API.AwayState) => void;
}

export type MessageSessionSlice<SessionT extends SessionType> = SessionSlice<SessionT> & {
  messages: MessageSlice;
};

export type ScrollableSessionSlice<SessionT extends SessionType> =
  SessionSlice<SessionT> & {
    scroll: SessionScrollHandler;
  };

export type HubStore = HubSessionSlice & MessageSessionSlice<API.Hub>;
export type PrivateChatStore = MessageSessionSlice<API.PrivateChat>;
export type FilelistStore = ScrollableSessionSlice<API.FilelistSession>;
export type ViewFileStore = ScrollableSessionSlice<API.ViewFile>;

export type BasicReadHandler = () => void;

export interface EventSlice extends UnreadInfoStore {
  isInitialized: boolean;
  logMessages: MessageListItem[] | null;
  messageCacheInfo: API.StatusMessageCounts | undefined;
  viewActive: boolean;
  scroll: ScrollHandler;

  setViewActive: (active: boolean) => void;

  onMessagesFetched: (messages: API.StatusMessage[]) => void;
  onLogMessage: (data: API.StatusMessage) => void;
  onMessageCountsReceived: (cacheInfoNew: API.StatusMessageCounts) => void;

  setReadHandler: (handler: BasicReadHandler) => void;
}

export interface SessionStore {
  hubs: HubStore;
  privateChats: PrivateChatStore;
  viewFiles: ViewFileStore;
  filelists: FilelistStore;

  activity: ActivitySlice;
  events: EventSlice;

  isInitialized: boolean;
}

export type SessionStoreSelector<SessionT extends SessionType = SessionType> = (
  state: SessionStore,
) => SessionSlice<SessionT>;

export type MessageStoreSelector<SessionT extends SessionType = SessionType> = (
  state: SessionStore,
) => MessageSessionSlice<SessionT>;

export type UnreadInfoStoreSelector = (state: SessionStore) => UnreadInfoStore;

export interface SessionStoreInitData {
  socket: APISocket;
  login: AuthenticatedSession;
}
