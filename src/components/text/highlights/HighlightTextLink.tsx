import MessageHighlightActions from 'actions/ui/MessageHighlightActions';
import { TableActionMenu } from 'components/menu';

import * as UI from 'types/ui';

import * as React from 'react';


export interface HighlightTextLinkProps /*extends Pick<TableDropdownProps, 'position'>*/ {
  text: string;
  highlightId: number;
  menuProps: UI.MessageActionMenuData;
  magnet?: UI.TextMagnet;
}

export const HighlightTextLink: React.FC<HighlightTextLinkProps> = ({ 
  text, highlightId, menuProps, magnet
}) => {
  const { boundary, ...other } = menuProps;
  return (
    <TableActionMenu
      className="highlight text link"
      actions={ MessageHighlightActions }
      itemData={{
        id: highlightId,
        text,
        magnet
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
