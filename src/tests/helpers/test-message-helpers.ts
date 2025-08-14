import { UIInstanceId } from '@/context/InstanceContext';
import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { isScrolledToBottom, scrollToMessage } from '@/utils/MessageUtils';
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
  instanceId: UIInstanceId,
  scrollContainer: HTMLElement,
  scrollDataGetter: () => number | undefined,
) => {
  // Scroll to message (this won't fire the scroll listener)
  scrollToMessage(messageId, instanceId);

  // Fire the scroll event with the new scroll position
  // May require multiple calls as the visible message list may not be updated immediately
  // by react-intersection-observer
  await waitFor(() => {
    fireEvent.scroll(scrollContainer, {
      target: { scrollTop: scrollContainer.scrollTop },
    });

    expect(scrollDataGetter()).toBe(messageId);
  });
};
