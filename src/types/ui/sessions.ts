import * as API from '@/types/api';

// ENTITIES
export interface SessionItemBase {
  id: API.IdType;
}

export type SessionItem = SessionItemBase & UnreadInfo;

export type UnreadInfo =
  | (MessageCounts & { read?: undefined })
  | (ReadStatus & { message_counts?: undefined });

export interface ReadStatus extends SessionItemBase {
  read: boolean;
}

export interface MessageCounts {
  message_counts: API.ChatMessageCounts | API.StatusMessageCounts;
}

export type ChatSessionItem = SessionItemBase & {
  message_counts: API.ChatMessageCounts;
};
