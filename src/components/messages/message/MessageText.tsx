import React from 'react';

import * as API from 'types/api';

import { HighlightedText } from '../../text/HighlightedText';
import { CommonMessageTextProps } from '../types';


interface MessageTextProps extends CommonMessageTextProps {
  message: API.Message; 
  emojify: boolean;
  user?: API.HubUser;
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
