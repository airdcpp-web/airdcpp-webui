import { IntersectionObserverProps } from 'react-intersection-observer';

import * as API from 'types/api';
import * as UI from 'types/ui';


export interface CommonMessageTextProps {
  addDownload: UI.AddItemDownload;
  highlightRemoteMenuId: string | undefined;
  entityId: API.IdType | undefined;
}

export interface CommonMessageProps extends Omit<IntersectionObserverProps, 'children'>, CommonMessageTextProps {

}