import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { isScrolledToBottom, scrollToMessage } from '@/utils/MessageUtils';
import { sleep } from '@/utils/Promise';
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

export const expectScrollTop = async (
  scrollContainer: HTMLElement,
  scrollTop: number,
) => {
  await waitFor(() =>
    expect(Math.round(scrollContainer.scrollTop)).toBe(Math.round(scrollTop)),
  );
};

export const scrollMessageView = async (
  messageId: number,
  scrollContainer: HTMLElement,
) => {
  // Scroll to message (this won't fire the scroll listener)
  scrollToMessage(messageId);

  // Wait for the scroll event to be processed
  await sleep(10);

  // Just fire the scroll event with the new scroll position
  fireEvent.scroll(scrollContainer, { target: { scrollTop: scrollContainer.scrollTop } });
};
