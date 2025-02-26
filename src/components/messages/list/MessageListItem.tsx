import * as React from 'react';

import { ChatMessage, StatusMessage } from '../message';

import * as UI from '@/types/ui';
import { CommonMessageProps } from '../types';

interface MessageListItemProps extends CommonMessageProps {
  id: string;
  message: UI.MessageListItem;
}

export const MessageListItem: React.FC<MessageListItemProps> = ({
  message,
  ...other
}) => {
  if (message.chat_message) {
    return (
      <ChatMessage
        message={message.chat_message}
        dropdownContext={other.highlightMenuProps.boundary}
        {...other}
      />
    );
  } else if (message.log_message) {
    return <StatusMessage message={message.log_message} {...other} />;
  }

  return null;
};
