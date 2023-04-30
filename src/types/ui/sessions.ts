import { Location } from 'react-router-dom';

import * as API from 'types/api';

import { IconType } from 'components/semantic/Icon';
import { RefluxActionListType } from './actions';
import { EmptyObject, ScrollPositionHandler } from './common';
import { MessageStore } from './messages';
import { UnreadInfoStore, UrgencyCountMap } from './urgencies';

export interface SessionInfoGetter<SessionT> {
  itemLabelGetter?: (session: SessionT) => React.ReactNode;
  itemNameGetter: (session: SessionT) => React.ReactNode;
  itemStatusGetter?: (session: SessionT) => string;
  itemHeaderTitleGetter?: (
    session: SessionT,
    location: Location,
    actionMenu: any
  ) => React.ReactNode;
  itemHeaderDescriptionGetter: (session: SessionT) => React.ReactNode;
  itemHeaderIconGetter: (session: SessionT) => IconType;
}

export type SessionActions<
  SessionT extends SessionItemBase,
  ActionT = EmptyObject
> = RefluxActionListType<SessionItemBase> &
  ActionT & {
    removeSession: (session: SessionT) => void;
    setRead: (session: SessionT) => void;
    sessionChanged: (session: SessionT | null) => void;
  };

export interface SessionRouteParams {
  id: string;
}

// export type SessionRouteProps = RouteComponentProps<SessionRouteParams>;

// ENTITIES
export interface SessionItemBase {
  id: API.IdType;
}

export type SessionItem = SessionItemBase & UnreadInfo;

export type UnreadInfo =
  | (MessageCounts & { read?: undefined })
  | (ReadStatus & { message_counts?: undefined });

/*export type SessionUpdateEventType = object & {
  id?: API.IdType;
};*/

//export type SessionUpdateProperties = Partial<SessionItem>;

export interface ReadStatus extends SessionItemBase {
  read: boolean;
}

export interface MessageCounts {
  message_counts: API.ChatMessageCounts | API.StatusMessageCounts;
}

export type SessionType = SessionItemBase & UnreadInfo;

export interface SessionMessageStore extends MessageStore {
  scroll: ScrollPositionHandler;
}

export interface SessionStore<SessionT extends SessionType = SessionType>
  extends UnreadInfoStore {
  getItemUrgencies: (item: SessionT) => UrgencyCountMap | null;
  getSession: (id: API.IdType) => SessionT | undefined;
  getSessions: () => SessionT[];
  getActiveSessionId: () => API.IdType | null;
}
