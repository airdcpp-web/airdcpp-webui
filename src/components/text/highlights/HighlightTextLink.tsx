import * as React from 'react';
import cx from 'classnames';

import MessageHighlightActions from 'actions/ui/message-highlight/MessageHighlightActions';
import { TableActionMenu } from 'components/action-menu';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { dupeToStringType } from 'utils/TypeConvert';

export interface HighlightTextLinkProps /*extends Pick<TableDropdownProps, 'position'>*/ {
  text: string;
  highlightId: number;
  menuProps: UI.MessageActionMenuData;
  magnet?: UI.TextMagnet;
  dupe: API.Dupe | null;
}

export const HighlightTextLink: React.FC<HighlightTextLinkProps> = ({
  text,
  highlightId,
  menuProps,
  magnet,
  dupe,
}) => {
  const { boundary, ...other } = menuProps;
  return (
    <TableActionMenu
      className={cx(
        'highlight text link',
        // Disable partial dupe coloring in messages to make the text more readable
        dupeToStringType(dupe).replace('partial', 'full'),
      )}
      actions={MessageHighlightActions}
      itemData={{
        id: highlightId,
        text,
        magnet,
      }}
      caption={text}
      triggerIcon={null}
      popupSettings={{
        boundary,
      }}
      {...other}
    />
  );
};
