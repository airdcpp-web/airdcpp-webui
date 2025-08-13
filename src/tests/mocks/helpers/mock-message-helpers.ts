import * as API from '@/types/api';
import { PrivateChat1MessageOther } from '../api/private-chat';
import { EventMessageInfo } from '../api/events';

export const generateChatMessages = (
  count: number,
  startId: number = 1000,
): API.ChatMessage[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...PrivateChat1MessageOther,
    id: startId + i,
    text: `Chat message ID ${startId + i}`,
    time: 1754956800 + i,
  }));
};

export const generateStatusMessages = (
  count: number,
  startId: number = 2000,
): API.StatusMessage[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...EventMessageInfo,
    id: startId + i,
    text: `Status message ID ${startId + i}`,
    time: 1754956800 + i,
  }));
};
