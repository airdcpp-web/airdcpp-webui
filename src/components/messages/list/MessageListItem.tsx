'use strict';
import React from 'react';

import { ChatMessage, StatusMessage } from '../message';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { CommonMessageProps } from '../types';


interface MessageListItemProps extends CommonMessageProps {
  id: string;
  message: UI.MessageListItem;
  addDownload: UI.AddItemDownload;
  entityId: API.IdType | undefined;
}

export const MessageListItem: React.FC<MessageListItemProps> = ({
  message,
  entityId,
  ...other
}) => {
  if (message.chat_message) {
    return (
      <ChatMessage
        message={ message.chat_message }
        dropdownContext=".chat.session"
        entityId={ entityId! }
        { ...other }
      />
    );
  } else if (message.log_message) {
    return (
      <StatusMessage
        message={ message.log_message }
        { ...other }
      />
    );
  }

  return null;
};
