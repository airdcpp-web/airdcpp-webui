import { useLayoutEffect, useRef } from 'react';

import * as UI from 'types/ui';

export const useRestoreScroll = (
  scrollPositionHandler: UI.ScrollHandler,
  session: UI.SessionItemBase,
) => {
  const scrollable = useRef<HTMLDivElement | null>(null);
  const onScroll = (evt: UIEvent) => {
    scrollPositionHandler.setScrollData(
      (evt.target as HTMLElement).scrollTop,
      session.id,
    );
  };

  const restoreScrollPosition = () => {
    const position = scrollPositionHandler.getScrollData(session.id);
    if (!!position) {
      // Wait for the layout to update
      setTimeout(() => {
        if (scrollable.current) {
          scrollable.current.scrollTo({
            top: position,
          });
        }
      });
    }
  };

  useLayoutEffect(() => {
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
  }, [scrollable.current]);

  return {
    scrollable,
    restoreScrollPosition,
  };
};
