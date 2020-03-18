import * as API from 'types/api';


export type MessageType = 'chat_message' | 'log_message';

export type MessageListItem = Partial<ChatMessageListItem & StatusMessageListItem>;

export type ChatMessageListItem = {
  chat_message: API.ChatMessage;
};

export type StatusMessageListItem = {
  log_message: API.StatusMessage;
};
