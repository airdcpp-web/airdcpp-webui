import { useLayoutEffect, useRef, useState } from 'react';

import * as UI from '@/types/ui';

export const useRestoreScroll = (
  scrollPositionHandler: UI.ScrollHandler,
  sessionItem: UI.SessionItemBase,
) => {
  const [isReady, setIsReady] = useState(false);
  const scrollable = useRef<HTMLDivElement | null>(null);
  const onScroll = (evt: UIEvent) => {
    const scrollPosition = (evt.target as HTMLElement).scrollTop;
    scrollPositionHandler.setScrollData(scrollPosition, sessionItem.id);
  };

  const onScrollableContentReady = () => {
    const position = scrollPositionHandler.getScrollData(sessionItem.id);

    // Wait for the layout to update
    setTimeout(() => {
      if (!!position && scrollable.current) {
        //console.log(
        //  `[SCROLL] Restoring scroll position ${position} for session ${session.id}`,
        //);

        scrollable.current.scrollTo({
          top: position,
        });
      } else {
        //console.log(
        //  `[SCROLL] Can't restore scroll position ${position} for session ${session.id}, ref missing`,
        //);
      }

      setIsReady(true);
    }, 1);
  };

  useLayoutEffect(() => {
    // Scroll listener for the element
    // console.log(`[SCROLL] Adding scroll listener for session ${session.id}`);
    if (isReady && scrollable.current) {
      scrollable.current.addEventListener('scroll', onScroll);
      return () => {
        scrollable.current!.removeEventListener('scroll', onScroll);
      };
    } else {
      // Shouldn't happen
      return;
    }
  }, [scrollable.current, sessionItem.id, isReady]);

  useLayoutEffect(() => {
    if (isReady) {
      setIsReady(false);
    }
  }, [sessionItem.id]);

  return {
    scrollable,
    onScrollableContentReady,
  };
};
