import { Location } from 'history';


export interface SessionInfoGetter<SessionT> {
  itemLabelGetter?: (session: SessionT) => React.ReactNode;
  itemNameGetter: (session: SessionT) => React.ReactNode;
  itemStatusGetter?: (session: SessionT) => string;
  itemHeaderTitleGetter?: (session: SessionT, location: Location, actionMenu: any) => React.ReactNode;
  itemHeaderDescriptionGetter: (session: SessionT) => React.ReactNode;
  itemHeaderIconGetter: (session: SessionT) => React.ReactNode;
}