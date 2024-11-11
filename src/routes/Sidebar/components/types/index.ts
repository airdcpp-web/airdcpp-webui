//import * as React from 'react';

import { IconType } from 'components/semantic/Icon';

import * as API from 'types/api';
import * as UI from 'types/ui';

export interface SessionLayoutLabels {
  // Label for button that opens a new session
  newCaption?: React.ReactNode;

  // Label for button that opens a new session
  newDescription?: React.ReactNode;

  // Label for button that opens a new session
  newIcon?: IconType;
}

export interface SessionLayoutManageProps<
  SessionT extends UI.SessionItemBase,
  SessionApiT extends object = UI.EmptyObject,
  UIActionT extends UI.ActionListType<UI.SessionItemBase> = UI.EmptyObject,
> {
  // Unique ID of the section (used for storing and loading the previously open tab)
  baseUrl: string;

  // Array of the items to list
  items: SessionT[];

  // Session actions to show in the action menu
  actionIds?: string[];

  uiActions: UI.ModuleActions<SessionT, void, UIActionT>;
  sessionApi: UI.SessionActions<SessionT> & SessionApiT;

  // Item ID that is currently active (if any)
  activeId: API.IdType | undefined;

  // AccessConstant defining whether the user has edit permission
  editAccess: API.AccessEnum;

  unreadInfoStore: UI.UnreadInfoStore;

  remoteMenuId: string;
}

interface SessionMainLayoutComponents {
  newButton: React.ReactElement<any> | null;
  listActionMenuGetter: () => React.ReactNode;
  itemHeaderTitle: React.ReactNode;
  itemHeaderDescription: React.ReactNode;
  itemHeaderIcon: IconType;
  sessionMenuItems: React.ReactNode[];
}

export interface SessionMainLayoutProps<
  SessionT extends UI.SessionItemBase,
  SessionApiT extends object = UI.EmptyObject,
  UIActionsT extends UI.ActionListType<UI.SessionItemBase> = UI.EmptyObject,
> extends Pick<
      SessionLayoutManageProps<SessionT, SessionApiT, UIActionsT>,
      'unreadInfoStore'
    >,
    SessionMainLayoutComponents {
  activeItem: SessionT | null;
  onKeyDown: (event: React.KeyboardEvent) => void;
  children: React.ReactNode;

  actions: SessionLayoutManageProps<SessionT, SessionApiT, UIActionsT>['uiActions'];
}

export type SessionChildProps<
  SessionT extends UI.SessionItemBase,
  SessionApiT extends object = UI.EmptyObject,
  UIActionsT extends UI.ActionListType<UI.SessionItemBase> = UI.EmptyObject,
> = Pick<
  SessionLayoutManageProps<SessionT, SessionApiT, UIActionsT>,
  'sessionApi' | 'uiActions'
> &
  UI.RouteComponentProps & {
    session: SessionT;
    sessionT: UI.ModuleTranslator;
  };

export interface NewSessionLayoutProps extends UI.RouteComponentProps {
  sessionT: UI.ModuleTranslator;
}

export interface SessionLocationState {
  pending?: boolean;
}
