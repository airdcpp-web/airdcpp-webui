import MessageHighlightActions from 'actions/ui/MessageHighlightActions';
import { TableActionMenu } from 'components/menu';
import { Location } from 'history';

import * as API from 'types/api';
// import * as UI from 'types/ui';

import React from 'react';


export interface ReleaseHighlightProps {
  text: string;
  location: Location;
  highlightRemoteMenuId?: string;
  entityId: API.IdType | undefined;
  highlightId: number;
}

export const ReleaseHighlight: React.FC<ReleaseHighlightProps> = ({ 
  text, highlightRemoteMenuId, highlightId, entityId 
}) => (
  <TableActionMenu
    className="highlight release"
    actions={ MessageHighlightActions }
    itemData={{
      id: highlightId,
      text
    }}
    remoteMenuId={ highlightRemoteMenuId }
    entityId={ entityId }
    caption={ text }
    triggerIcon={ null }
    popupSettings={{
      boundary: '.message-list'
    }}
  />
);
