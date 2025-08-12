import { useState, useLayoutEffect, useEffect } from 'react';

import * as UI from '@/types/ui';
import { isScrolledToBottom, scrollToMessage } from '@/utils/MessageUtils';

const DEBUG = false;

interface Props {
  scrollPositionHandler: UI.ScrollHandler;
  chatSession: UI.SessionItemBase | undefined;
  messages: UI.MessageListItem[] | null;
}

const dbgMessage = (msg: string, chatSession: UI.SessionItemBase | undefined) => {
  if (DEBUG) {
    let message = msg;
    if (chatSession) {
      message += ` (session ${chatSession.id})`;
    } else {
      message += ` (no session)`;
    }

    console.log(message);
  }
};

export const useMessageViewScrollEffect = (
  { messages, scrollPositionHandler, chatSession }: Props,
  visibleItems: number[],
  scrollable: HTMLDivElement | null,
) => {
  const sessionId = !!chatSession ? chatSession.id : undefined;
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const hasMessages = !!messages && !!messages.length;

  const setScrollData = () => {
    if (!scrollable) {
      dbgMessage('Scrollable element not found', chatSession);
      return;
    }

    if (!visibleItems.length) {
      dbgMessage('No visible items to save scroll position', chatSession);
      return;
    }

    const shouldScrollToBottomNew = isScrolledToBottom(scrollable);
    const messageId = shouldScrollToBottomNew
      ? undefined
      : Math.min.apply(null, Array.from(visibleItems));

    dbgMessage(
      // eslint-disable-next-line max-len
      `Save scroll position, visible items ${Array.from(visibleItems).join(', ')}, messageId: ${messageId}, shouldScrollToBottom: ${shouldScrollToBottomNew}`,
      chatSession,
    );

    scrollPositionHandler.setScrollData(messageId, sessionId);
    setShouldScrollToBottom(shouldScrollToBottomNew);
  };

  useEffect(() => setScrollData(), [visibleItems]);

  const scrollToBottom = () => {
    if (scrollable) {
      scrollable.scrollTop = scrollable.scrollHeight;
    }
  };

  useLayoutEffect(() => {
    if (hasMessages && shouldScrollToBottom) {
      scrollToBottom();
    }
  }, [hasMessages, messages]);

  useLayoutEffect(() => {
    if (hasMessages) {
      const scrollItemId = scrollPositionHandler.getScrollData(sessionId);
      if (scrollItemId) {
        dbgMessage(
          `Session changed, restoring scroll position to message ${scrollItemId}`,
          chatSession,
        );

        if (!scrollToMessage(scrollItemId)) {
          dbgMessage('Failed to restore scroll position', chatSession);

          scrollToBottom();
        }
      } else {
        dbgMessage('Session changed, scroll to bottom', chatSession);
        scrollToBottom();
      }
    } else {
      dbgMessage('Session changed, no messages to restore scroll position', chatSession);
    }
  }, [sessionId, hasMessages]);

  return scrollable;
};
