import React from 'react';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { HighlightedText } from '../../text/HighlightedText';


interface MessageTextProps {
  message: API.Message; 
  emojify: boolean;
  addDownload: UI.AddItemDownload;
  user?: API.HubUser;
}

export const MessageText: React.FC<MessageTextProps> = ({ addDownload, emojify, message, user }) => (
  <div className="text">
    <HighlightedText
      emojify={ emojify }
      text={ message.text }
      highlights={ message.highlights }
      user={ user }
      addDownload={ addDownload }
    />
  </div>
);
