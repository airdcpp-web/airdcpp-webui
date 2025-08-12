import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { isScrolledToBottom } from '@/utils/MessageUtils';
import { fireEvent, waitFor } from '@testing-library/dom';
import { expect } from 'vitest';

export const incrementChatSessionUserMessageCounts = (
  messageCounts: API.ChatMessageCounts,
  sessionId: API.IdType,
  store: UI.SessionSlice<UI.ChatSessionItem>,
) => ({
  message_counts: {
    total: store.getSession(sessionId)!.message_counts.total + 1,
    unread: {
      ...messageCounts.unread,
      user: messageCounts.unread.user + 1,
    },
  },
});

export const expectScrolledToBottom = (scrollContainer: HTMLElement) => {
  return expect(isScrolledToBottom(scrollContainer, 1)).toBeTruthy();
};

export const scrollMessageView = async (
  scrollTop: number,
  scrollContainer: HTMLElement,
) => {
  // Scroll to the new position (will trigger the scroll event instantly with the old visible message IDs)
  fireEvent.scroll(scrollContainer, { target: { scrollTop } });

  // Wait for the scroll event to be processed
  await waitFor(() => expect(Math.round(scrollContainer.scrollTop)).toBe(scrollTop));
};
