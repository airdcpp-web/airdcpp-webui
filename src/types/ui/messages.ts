import * as API from 'types/api';

import { AddItemDownload } from './downloads';


export type MessageType = 'chat_message' | 'log_message';

export type MessageListItem = Partial<ChatMessageListItem & StatusMessageListItem>;

export type ChatMessageListItem = {
  chat_message: API.ChatMessage;
};

export type StatusMessageListItem = {
  log_message: API.StatusMessage;
};


export interface MessageActionMenuData {
  addDownload: AddItemDownload;
  remoteMenuId: string | undefined;
  entityId: API.IdType | undefined;
  position?: string;
  boundary: string;
}
