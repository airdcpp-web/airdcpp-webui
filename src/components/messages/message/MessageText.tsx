import * as React from 'react';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { HighlightedText } from '../../text/HighlightedText';

interface MessageTextProps {
  message: API.Message;
  emojify: boolean;
  user?: API.HubUser;
  label?: string;
  highlightMenuProps: UI.MessageActionMenuData;
}

export const MessageText: React.FC<MessageTextProps> = ({
  emojify,
  message,
  user,
  label,
  highlightMenuProps,
  ...other
}) => (
  <div className="text">
    {!!label && <span className="label">{`${label}: `}</span>}
    <HighlightedText
      emojify={emojify}
      text={message.text}
      highlights={message.highlights}
      user={user}
      menuProps={highlightMenuProps}
      {...other}
    />
  </div>
);
