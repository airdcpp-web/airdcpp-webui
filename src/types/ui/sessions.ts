import { Location } from 'react-router-dom';

import * as API from 'types/api';

import { IconType } from 'components/semantic/Icon';
import { ActionListType, ModuleActions, RefluxActionListType } from './actions';
import { EmptyObject, RouteComponentProps, ScrollPositionHandler } from './common';
import { MessageStore } from './messages';
import { UnreadInfoStore, UrgencyCountMap } from './urgencies';
import { ModuleTranslator } from './modules';

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

// ENTITIES
export interface SessionItemBase {
  id: API.IdType;
}

export type SessionItem = SessionItemBase & UnreadInfo;

export type UnreadInfo =
  | (MessageCounts & { read?: undefined })
  | (ReadStatus & { message_counts?: undefined });

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

// LAYOUT

export interface SessionLayoutLabels {
  // Label for button that opens a new session
  newCaption?: React.ReactNode;

  // Label for button that opens a new session
  newDescription?: React.ReactNode;

  // Label for button that opens a new session
  newIcon?: IconType;
}

export interface SessionLayoutManageProps<
  SessionT extends SessionItemBase,
  SessionApiT extends object = EmptyObject,
  UIActionT extends ActionListType<SessionItemBase> = EmptyObject
> {
  // Unique ID of the section (used for storing and loading the previously open tab)
  baseUrl: string;

  // Array of the items to list
  items: SessionT[];

  // Session actions to show in the action menu
  actionIds?: string[];

  uiActions: ModuleActions<SessionT, UIActionT>;
  sessionApi: SessionActions<SessionT> & SessionApiT;

  // Item ID that is currently active (if any)
  activeId: API.IdType | undefined;

  // AccessConstant defining whether the user has edit permission
  editAccess: API.AccessEnum;

  unreadInfoStore: UnreadInfoStore;
}

/*export interface SessionMainLayoutProps<
  SessionT extends SessionItemBase,
  SessionApiT extends object = EmptyObject,
  UIActionsT extends ActionListType<SessionItemBase> = EmptyObject
> extends Pick<
    SessionLayoutManageProps<SessionT, SessionApiT, UIActionsT>,
    'unreadInfoStore'
  > {
  newButton: React.ReactElement<any> | null;
  listActionMenuGetter: () => React.ReactNode;
  itemHeaderTitle: React.ReactNode;
  itemHeaderDescription: React.ReactNode;
  itemHeaderIcon: IconType;

  sessionMenuItems: React.ReactNode[];
  activeItem: SessionT | null;
  onKeyDown: (event: React.KeyboardEvent) => void;
  children: React.ReactNode;

  actions: SessionLayoutManageProps<SessionT, SessionApiT, UIActionsT>['uiActions'];
}*/

export type SessionChildProps<
  SessionT extends SessionItemBase,
  SessionApiT extends object = EmptyObject,
  UIActionsT extends ActionListType<SessionItemBase> = EmptyObject
> = Pick<
  SessionLayoutManageProps<SessionT, SessionApiT, UIActionsT>,
  'sessionApi' | 'uiActions'
> &
  RouteComponentProps & {
    session: SessionT;
    sessionT: ModuleTranslator;
  };

export interface NewSessionLayoutProps extends RouteComponentProps {
  sessionT: ModuleTranslator;
}

export interface SessionLocationState {
  pending?: boolean;
}
