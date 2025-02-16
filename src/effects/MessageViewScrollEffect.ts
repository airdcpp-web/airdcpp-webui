import { useState, useRef, useLayoutEffect } from 'react';

import * as UI from 'types/ui';
import { getListMessageIdString } from 'utils/MessageUtils';

const MAX_IS_BOTTOM_OFFSET_PX = 30;

const isScrolledToBottom = (element: HTMLElement) => {
  const { scrollHeight, scrollTop, offsetHeight } = element;
  const offSetFromBottom = scrollHeight - (scrollTop + offsetHeight);
  return Math.abs(offSetFromBottom) < MAX_IS_BOTTOM_OFFSET_PX;
};

const DEBUG = false;

interface Props {
  scrollPositionHandler: UI.ScrollHandler;
  session?: UI.SessionItemBase;
  messages: UI.MessageListItem[] | null;
}

export const useMessageViewScrollEffect = (
  { messages, scrollPositionHandler, session }: Props,
  visibleItems: Set<number>,
) => {
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const scrollable = useRef<HTMLDivElement | null>(null);
  const sessionId = !!session ? session.id : undefined;
  const hasMessages = !!messages && !!messages.length;

  const onScroll = (evt: UIEvent) => {
    if (!hasMessages) {
      return;
    }

    const shouldScrollToBottomNew = isScrolledToBottom(evt.target as HTMLElement);

    if (!!visibleItems.size) {
      // Wait for the message visibilities to update before saving
      setTimeout(() => {
        const messageId = shouldScrollToBottomNew
          ? undefined
          : Math.min.apply(null, Array.from(visibleItems));
        if (DEBUG) {
          console.log(
            `Save scroll position, visible items ${Array.from(visibleItems).join(', ')}`,
          );
        }

        scrollPositionHandler.setScrollData(messageId, sessionId);
      });
    }

    setShouldScrollToBottom(shouldScrollToBottomNew);
  };

  const scrollToBottom = () => {
    if (scrollable.current) {
      scrollable.current.scrollTop = scrollable.current.scrollHeight;
    }
  };

  useLayoutEffect(() => {
    // Scroll listener for the element
    if (scrollable.current && hasMessages) {
      scrollable.current.addEventListener('scroll', onScroll);

      return () => {
        scrollable.current!.removeEventListener('scroll', onScroll);
      };
    } else {
      // Shouldn't happen
      return;
    }
  }, [scrollable.current, hasMessages, sessionId]);

  useLayoutEffect(() => {
    if (hasMessages && shouldScrollToBottom) {
      scrollToBottom();
    }
  }, [hasMessages, messages]);

  useLayoutEffect(() => {
    if (hasMessages) {
      const scrollItemId = scrollPositionHandler.getScrollData(sessionId);
      if (scrollItemId) {
        const id = getListMessageIdString(scrollItemId);

        if (DEBUG) {
          console.log(`Session changed, restoring scroll position to message ${id}`);
        }

        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView();
        } else if (DEBUG) {
          console.log('Restore failed');
        }
      } else {
        if (DEBUG) {
          console.log('Session changed, scroll to bottom');
        }

        scrollToBottom();
      }
    }
  }, [sessionId, hasMessages]);

  return scrollable;
};
