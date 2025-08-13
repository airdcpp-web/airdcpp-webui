import { useState, useLayoutEffect } from 'react';

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
  visibleItems: Set<number>,
  scrollable: HTMLDivElement | null,
) => {
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const sessionId = !!chatSession ? chatSession.id : undefined;
  const hasMessages = !!messages && !!messages.length;

  const onScroll = (evt: UIEvent) => {
    if (!hasMessages) {
      return;
    }

    const shouldScrollToBottomNew = isScrolledToBottom(evt.target as HTMLElement);

    // Wait for the message visibilities to update before saving
    setTimeout(() => {
      if (!visibleItems.size) {
        dbgMessage('No visible items to save scroll position', chatSession);
        return;
      }

      const messageId = shouldScrollToBottomNew
        ? undefined
        : Math.min.apply(null, Array.from(visibleItems));
      dbgMessage(
        `Save scroll position, visible items ${Array.from(visibleItems).join(', ')}`,
        chatSession,
      );

      scrollPositionHandler.setScrollData(messageId, sessionId);
    });

    setShouldScrollToBottom(shouldScrollToBottomNew);
  };

  const scrollToBottom = () => {
    if (scrollable) {
      scrollable.scrollTop = scrollable.scrollHeight;
    }
  };

  useLayoutEffect(() => {
    // Scroll listener for the element
    if (scrollable && hasMessages) {
      scrollable.addEventListener('scroll', onScroll);

      return () => {
        scrollable!.removeEventListener('scroll', onScroll);
      };
    } else {
      // Shouldn't happen
      return;
    }
  }, [scrollable, hasMessages, sessionId]);

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
};
