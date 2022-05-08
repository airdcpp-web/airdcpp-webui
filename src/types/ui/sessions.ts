import { Location } from 'history';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { IconType } from 'components/semantic/Icon';
import { RouteComponentProps } from 'react-router-dom';
import { /*ActionListType,*/ RefluxActionListType } from './actions';


export interface SessionInfoGetter<SessionT> {
  itemLabelGetter?: (session: SessionT) => React.ReactNode;
  itemNameGetter: (session: SessionT) => React.ReactNode;
  itemStatusGetter?: (session: SessionT) => string;
  itemHeaderTitleGetter?: (session: SessionT, location: Location, actionMenu: any) => React.ReactNode;
  itemHeaderDescriptionGetter: (session: SessionT) => React.ReactNode;
  itemHeaderIconGetter: (session: SessionT) => IconType;
}

export type SessionActions<
  SessionT extends SessionItemBase, 
  ActionT = UI.EmptyObject
> = RefluxActionListType<SessionItemBase> & ActionT & {
  removeSession: (session: SessionT) => void;  
  setRead: (session: SessionT) => void;
  sessionChanged: (session: SessionT | null) => void;
};


export interface SessionRouteParams { 
  id: string; 
}

export type SessionRouteProps = RouteComponentProps<SessionRouteParams>;

// ENTITIES
export interface SessionItemBase {
  id: API.IdType;
}


export type SessionItem = SessionItemBase & UnreadInfo;

export type UnreadInfo = 
  (
    (MessageCounts & { read?: undefined }) | 
    (ReadStatus & { message_counts?: undefined })
  );

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