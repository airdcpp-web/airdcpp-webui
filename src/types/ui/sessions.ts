import { Location } from 'history';

import * as API from 'types/api';


export interface SessionInfoGetter<SessionT> {
  itemLabelGetter?: (session: SessionT) => React.ReactNode;
  itemNameGetter: (session: SessionT) => React.ReactNode;
  itemStatusGetter?: (session: SessionT) => string;
  itemHeaderTitleGetter?: (session: SessionT, location: Location, actionMenu: any) => React.ReactNode;
  itemHeaderDescriptionGetter: (session: SessionT) => React.ReactNode;
  itemHeaderIconGetter: (session: SessionT) => React.ReactNode;
}


export interface SessionItemBase {
  id: API.IdType;
}

export type SessionItem = 
  (
    (MessageSessionItem & { read?: undefined }) | 
    (ReadableSessionItem & { message_counts?: undefined })
  );

/*export type SessionUpdateEventType = object & {
  id?: API.IdType;
};*/

export type SessionUpdateProperties = Partial<SessionItem>;

export interface ReadableSessionItem extends SessionItemBase {
  read: boolean;
}

export interface MessageSessionItem extends SessionItemBase {
  message_counts: API.ChatMessageCounts | API.StatusMessageCounts;
}