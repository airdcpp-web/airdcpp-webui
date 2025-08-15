import { Location } from 'react-router';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { IconType } from '@/components/semantic/Icon';
import { ActionListType, ModuleActions } from './actions';
import { EmptyObject, RouteComponentProps } from './common';
import { ModuleTranslator } from './modules';
import { SessionItemBase } from './sessions';
import { UnreadInfoStore } from './session-store';
import { APISocket } from '@/services/SocketService';

export type SessionAPIActions<SessionT extends SessionItemBase> = {
  removeSession: (sessionItem: SessionT, socket: APISocket) => void;
  setRead: (sessionItem: UI.SessionItemBase, socket: APISocket) => void;
};

export interface SessionRouteParams {
  id: string;
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
  UIActionT extends ActionListType<SessionItemBase> = EmptyObject,
> {
  // Unique ID of the section (used for storing and loading the previously open tab)
  baseUrl: string;

  // Array of the items to list
  items: SessionT[];

  // Session actions to show in the action menu
  actionIds?: string[];

  uiActions: ModuleActions<SessionT, void, UIActionT>;
  sessionApi: SessionAPIActions<SessionT> & SessionApiT;

  // Item ID that is currently active (if any)
  activeId: API.IdType | undefined;

  // AccessConstant defining whether the user has edit permission
  editAccess: API.AccessEnum;

  unreadInfoStore: UnreadInfoStore;
}

export interface SessionInfoGetter<SessionT> {
  itemLabelGetter?: (sessionItem: SessionT) => React.ReactNode;
  itemNameGetter: (sessionItem: SessionT) => string;
  itemStatusGetter?: (sessionItem: SessionT) => string;
  itemHeaderTitleGetter?: (
    sessionItem: SessionT,
    location: Location,
    actionMenu: any,
  ) => React.ReactNode;
  itemHeaderDescriptionGetter: (sessionItem: SessionT) => React.ReactNode;
  itemHeaderIconGetter: (sessionItem: SessionT) => IconType;
}

export type SessionChildProps<
  SessionT extends SessionItemBase,
  SessionApiT extends object = EmptyObject,
  UIActionsT extends ActionListType<SessionItemBase> = EmptyObject,
> = Pick<
  SessionLayoutManageProps<SessionT, SessionApiT, UIActionsT>,
  'sessionApi' | 'uiActions'
> &
  RouteComponentProps & {
    sessionItem: SessionT;
    sessionT: ModuleTranslator;
  };

export interface NewSessionLayoutProps extends RouteComponentProps {
  sessionT: ModuleTranslator;
}

export interface SessionLocationState {
  pending?: boolean;
}
