import React from 'react';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { HighlightedText } from '../../text/HighlightedText';


interface MessageTextProps {
  message: API.Message; 
  emojify: boolean;
  user?: API.HubUser;
  menuProps: UI.MessageActionMenuData;
}

export const MessageText: React.FC<MessageTextProps> = ({ emojify, message, user, ...other }) => (
  <div className="text">
    <HighlightedText
      emojify={ emojify }
      text={ message.text }
      highlights={ message.highlights }
      user={ user }
      { ...other }
    />
  </div>
);
