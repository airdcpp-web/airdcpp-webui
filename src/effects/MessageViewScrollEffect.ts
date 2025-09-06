import { useLayoutEffect, useRef } from 'react';

import * as UI from '@/types/ui';

import { isScrolledToBottom, scrollToMessage } from '@/utils/MessageUtils';
import { useUIInstance } from '@/context/InstanceContext';

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
  const shouldScrollToBottom = useRef(true);
  const sessionId = !!chatSession ? chatSession.id : undefined;
  const hasMessages = !!messages && !!messages.length;
  const instanceId = useUIInstance();

  const onScroll = (evt: UIEvent) => {
    if (!hasMessages) {
      dbgMessage('No messages in the scroll handler', chatSession);
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
        `Save scroll position ${messageId}, visible items ${Array.from(visibleItems).join(', ')}`,
        chatSession,
      );

      scrollPositionHandler.setScrollData(messageId, sessionId);
    });

    shouldScrollToBottom.current = shouldScrollToBottomNew;
  };

  const scrollToBottom = () => {
    if (scrollable) {
      scrollable.scrollTop = scrollable.scrollHeight;
    } else {
      dbgMessage('No scrollable element to scroll to bottom', chatSession);
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
    if (scrollable && hasMessages && shouldScrollToBottom.current) {
      dbgMessage('Scroll to bottom', chatSession);
      scrollToBottom();
    }
  }, [scrollable, hasMessages, messages]);

  useLayoutEffect(() => {
    if (!scrollable) {
      return;
    }

    if (hasMessages) {
      const scrollItemId = scrollPositionHandler.getScrollData(sessionId);
      if (scrollItemId) {
        dbgMessage(
          `Session changed, restoring scroll position to message ${scrollItemId}`,
          chatSession,
        );

        if (!scrollToMessage(scrollItemId, instanceId)) {
          dbgMessage(
            'Failed to restore scroll position (message not found, scroll to bottom)',
            chatSession,
          );
          shouldScrollToBottom.current = true;
        }
      } else {
        dbgMessage(
          'Session changed, no scroll position to restore (scroll to bottom)',
          chatSession,
        );
        shouldScrollToBottom.current = true;
      }
    } else {
      dbgMessage('Session changed, no messages to restore scroll position', chatSession);
    }
  }, [scrollable, sessionId, hasMessages]);
};
