import { 
  useState, useEffect, useRef, useLayoutEffect
} from 'react';

import * as UI from 'types/ui';


// 
export const useMessageViewScrollEffect = (messages: UI.MessageListItem[] | null, session?: UI.SessionItemBase) => {
  const [ shouldScrollToBottom, setShouldScrollToBottom ] = useState(true);
  const scrollable = useRef<HTMLDivElement | null>(null);

  const onScroll = (evt: UIEvent) => {
    const { scrollHeight, scrollTop, offsetHeight } = evt.target as HTMLElement;
    const offSetFromBottom = scrollHeight - (scrollTop + offsetHeight);

    //console.log('SHOULD SCROLL', Math.abs(offSetFromBottom) < 10, offSetFromBottom);
    setShouldScrollToBottom(Math.abs(offSetFromBottom) < 10);
  };

  
  const scrollToBottom = () => {
    if (scrollable.current) {
      scrollable.current.scrollTop = scrollable.current.scrollHeight;
    }
  };

  useLayoutEffect(
    () => {
      // Scroll listener for the element
      if (scrollable.current) {
        scrollable.current.addEventListener('scroll', onScroll);

        return () => {
          scrollable.current!.removeEventListener('scroll', onScroll);
        };
      } else {
        // Shouldn't happen
        return;
      }
    },
    []
  );

  useLayoutEffect(
    () => {
      // Messages changed
      if (shouldScrollToBottom) {
        scrollToBottom();
      }
    },
    [ messages ]
  );

  
  useLayoutEffect(
    () => {
      // Session changed, always scroll to bottom
      scrollToBottom();
    },
    [ !!session, !!session ? session.id : null ]
  );

  return scrollable;
};