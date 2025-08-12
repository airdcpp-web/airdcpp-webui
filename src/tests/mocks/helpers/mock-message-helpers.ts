import * as API from '@/types/api';
import { PrivateChat1MessageOther } from '../api/private-chat';
import { EventMessageInfo } from '../api/events';

export const generateChatMessages = (count: number): API.ChatMessage[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...PrivateChat1MessageOther,
    id: 1000 + i,
    text: `Chat message ID ${1000 + i}`,
  }));
};

export const generateStatusMessages = (count: number): API.StatusMessage[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...EventMessageInfo,
    id: 2000 + i,
    text: `Status message ID ${2000 + i}`,
  }));
};
