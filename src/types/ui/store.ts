import * as API from '@/types/api';

import { MessageCounts, SessionItemBase, SessionType } from './sessions';
import { UrgencyCountMap } from './urgencies';
import { MessageListItem } from './messages';
import { Getter, LensContext, ResolveStoreApi, Setter } from '@dhmk/zustand-lens';
import { APISocket } from '@/services/SocketService';
import { AuthenticatedSession } from './auth';
import { SubscriptionCallback } from 'airdcpp-apisocket';

export interface UnreadInfoStore {
  getTotalUrgencies: () => UrgencyCountMap | null;
}

export type AddSliceListener = (
  listenerName: string,
  callback: SubscriptionCallback,
) => Promise<void>;

export interface SessionInitData extends StoreInitData {
  addSocketListener: AddSliceListener;
}

export type AddSessionSliceListener = (data: SessionInitData) => void;

export type SessionReadHandler = (session: SessionItemBase) => void;

export interface SessionSlice<SessionT extends SessionType> extends UnreadInfoStore {
  readonly sessions: Array<SessionT> | null;
  readonly activeSessionId: API.IdType | null;

  isInitialized: () => boolean;

  init: (data: SessionT[]) => void;
  setActiveSession: (session: SessionT | null) => void;
  getItemUrgencies: (item: SessionT) => UrgencyCountMap | null;
  getSession: (id: API.IdType) => SessionT | undefined;

  createSession: (session: SessionT) => void;
  updateSession: (session: Partial<SessionT>, id: API.IdType) => void;
  removeSession: (session: SessionT) => void;

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

  onFetchMessages: (session: SessionItemBase) => void;
  onMessagesFetched: (session: SessionItemBase, cacheMessages: MessageListItem[]) => void;
  addChatMessage: (data: API.Message, sessionId: API.IdType) => void;
  addStatusMessage: (data: API.Message, sessionId: API.IdType) => void;
  updateSession: (session: Partial<MessageCounts>, sessionId: API.IdType) => void;
  removeSession: (session: SessionItemBase) => void;

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
}

export interface Store extends SessionStore {
  activity: ActivitySlice;
  events: EventSlice;
}

export type LensSlice<
  L,
  T extends L,
  S = unknown,
  SetterFn = Setter<T>,
  Ctx = LensContext<L, S>,
> = (
  set: SetterFn,
  get: Getter<T>,
  api: ResolveStoreApi<S>,
  ctx: Ctx,
) => L /*& LensMeta<T, S>*/;

export type SessionStoreSelector<SessionT extends SessionType = SessionType> = (
  state: Store,
) => SessionSlice<SessionT>;

export type MessageStoreSelector<SessionT extends SessionType = SessionType> = (
  state: Store,
) => MessageSessionSlice<SessionT>;

export type UnreadInfoStoreSelector = (state: Store) => UnreadInfoStore;

export interface StoreInitData {
  socket: APISocket;
  login: AuthenticatedSession;
}
