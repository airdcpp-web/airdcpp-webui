import { useState, useLayoutEffect, useEffect } from 'react';

import * as UI from '@/types/ui';
import { isScrolledToBottom, scrollToMessage } from '@/utils/MessageUtils';

const DEBUG = true;

interface Props {
  scrollPositionHandler: UI.ScrollHandler;
  session?: UI.SessionItemBase;
  messages: UI.MessageListItem[] | null;
}

const dbgMessage = (msg: string, session: UI.SessionItemBase | undefined) => {
  if (DEBUG) {
    let message = msg;
    if (session) {
      message += ` (session ${session.id})`;
    } else {
      message += ` (no session)`;
    }

    console.log(message);
  }
};

export const useMessageViewScrollEffect = (
  { messages, scrollPositionHandler, session }: Props,
  visibleItems: number[],
  scrollable: HTMLDivElement | null,
) => {
  const sessionId = !!session ? session.id : undefined;
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const hasMessages = !!messages && !!messages.length;

  const setScrollData = () => {
    if (!scrollable) {
      dbgMessage('Scrollable element not found', session);
      return;
    }

    if (!visibleItems.length) {
      dbgMessage('No visible items to save scroll position', session);
      return;
    }

    const shouldScrollToBottomNew = isScrolledToBottom(scrollable);
    const messageId = shouldScrollToBottomNew
      ? undefined
      : Math.min.apply(null, Array.from(visibleItems));

    dbgMessage(
      // eslint-disable-next-line max-len
      `Save scroll position, visible items ${Array.from(visibleItems).join(', ')}, messageId: ${messageId}, shouldScrollToBottom: ${shouldScrollToBottomNew}`,
      session,
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
          session,
        );

        if (!scrollToMessage(scrollItemId)) {
          dbgMessage('Failed to restore scroll position', session);

          scrollToBottom();
        }
      } else {
        dbgMessage('Session changed, scroll to bottom', session);
        scrollToBottom();
      }
    } else {
      dbgMessage('Session changed, no messages to restore scroll position', session);
    }
  }, [sessionId, hasMessages]);

  return scrollable;
};
