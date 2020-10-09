import MessageHighlightActions from 'actions/ui/MessageHighlightActions';
import { TableActionMenu } from 'components/menu';

import * as UI from 'types/ui';

import React from 'react';


export interface HighlightTextLinkProps /*extends Pick<TableDropdownProps, 'position'>*/ {
  text: string;
  highlightId: number;
  menuProps: UI.MessageActionMenuData;
}

export const HighlightTextLink: React.FC<HighlightTextLinkProps> = ({ 
  text, highlightId, menuProps
}) => {
  const { boundary, ...other } = menuProps;
  return (
    <TableActionMenu
      className="highlight text link"
      actions={ MessageHighlightActions }
      itemData={{
        id: highlightId,
        text
      }}
      caption={ text }
      triggerIcon={ null }
      popupSettings={{
        boundary
      }}
      { ...other }
    />
  );
};
