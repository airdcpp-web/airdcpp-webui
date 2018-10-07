import * as API from 'types/api';


export type MessageType = 'chat_message' | 'log_message';
/*export type MessageListItem = { 
  [key in MessageType]: API.Message
};*/

export type MessageListItem = 
  (ChatMessageListItem & { log_message?: undefined }) | 
  (StatusMessageListItem & { chat_message?: undefined });

export type ChatMessageListItem = {
  chat_message: API.ChatMessage;
};

export type StatusMessageListItem = {
  log_message: API.StatusMessage;
};
