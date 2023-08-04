import * as React from 'react';

import { loadLocalProperty, saveLocalProperty } from 'utils/BrowserUtils';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { useLocation } from 'react-router-dom';
import { useSessionRouteHelpers } from './useSessionHelpers';
import { SessionLocationState } from '../types';

const findItem = <SessionT extends UI.SessionItemBase>(
  items: SessionT[],
  id: API.IdType | undefined
): SessionT | undefined => {
  return items.find((item) => item.id === id);
};

export interface SessionManagerProps<
  SessionT extends UI.SessionItemBase,
  SessionApiT extends object = UI.EmptyObject
> {
  // Item ID that is currently active (if any)
  activeId: API.IdType | undefined;

  // Array of the items to list
  items: SessionT[];

  baseUrl: string;

  sessionApi: UI.SessionActions<SessionT> & SessionApiT;
}

export const useSessionManager = <
  SessionT extends UI.SessionItemBase,
  SessionApiT extends object = UI.EmptyObject
>(
  props: SessionManagerProps<SessionT, SessionApiT>
) => {
  const [activeItem, setActiveItem] = React.useState<SessionT | null>(null);
  const location = useLocation();

  const { pushSession, replaceSession, newUrl, replaceNew } = useSessionRouteHelpers({
    baseUrl: props.baseUrl,
  });

  // HELPERS
  const getStorageKey = () => {
    return `${props.baseUrl}_last_active`;
  };

  // Common logic for selecting the item to display (after mounting or session updates)
  // Returns true active item selection was handled
  // Returns false if the active item couldn't be selected but there are valid items to choose from by the caller
  const checkActiveItem = () => {
    // Did we just create this session?
    const routerLocation = location;
    const pending =
      routerLocation.state && (routerLocation.state as SessionLocationState).pending;

    // Update the active item
    const activeItemNew = findItem(props.items, props.activeId);
    if (activeItemNew) {
      if (pending) {
        // Disable pending state
        replaceSession(activeItemNew.id, {
          pending: false,
        });

        return true;
      }

      setActiveItem(activeItemNew);
      saveLocalProperty(getStorageKey(), props.activeId);
      return true;
    } else if (pending) {
      // We'll just display a loading indicator in 'render', no item needed
      return true;
    } else if (/*routerLocation.action === 'POP' ||*/ props.items.length === 0) {
      // Browsing from history and item removed (or all items removed)... go to "new session" page
      replaceNew();
      setActiveItem(null);
      return true;
    }

    return false;
  };

  // LIFECYCLE/REACT
  React.useEffect(() => {
    if (location.pathname === newUrl) {
      // Don't redirect to it if the "new session" layout is open
      if (activeItem) {
        setActiveItem(null);
      }
      return;
    }

    if (checkActiveItem()) {
      // We got an item
      return;
    }

    if (!activeItem) {
      const lastId = loadLocalProperty<API.IdType>(getStorageKey());
      if (lastId && findItem(props.items, lastId)) {
        // Previous session exists
        replaceSession(lastId);
        return;
      }
    }

    // The old tab was closed or we didn't have any session before

    const { items, activeId } = props;
    let newItemPos = 0;
    const oldItem = findItem(items, activeId);
    if (oldItem) {
      // Find the old position and use the item in that position (if possible)
      newItemPos = items.indexOf(oldItem);
      if (newItemPos === items.length - 1) {
        // The last item was removed
        newItemPos = newItemPos - 1;
      }
    }

    replaceSession(items[newItemPos].id);
  }, [location, props.items]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const { key, altKey } = event;

    if (altKey && (key === 'ArrowUp' || key === 'ArrowDown')) {
      // Arrow up/down
      event.preventDefault();

      const { items, activeId } = props;
      const item = findItem(items, activeId);
      if (!item) {
        return;
      }

      const currentIndex = items.indexOf(item);
      if (currentIndex === -1) {
        return;
      }

      const newSession = items[key === 'ArrowUp' ? currentIndex - 1 : currentIndex + 1];
      if (newSession) {
        pushSession(newSession.id);
      }
    } else if (altKey && key === 'Insert') {
      // Insert
      event.preventDefault();

      replaceNew();
    } else if (altKey && key === 'Delete') {
      // Delete
      event.preventDefault();

      const { items, activeId, sessionApi } = props;
      const item = findItem(items, activeId);
      if (!!item) {
        sessionApi.removeSession(item);
      }
    }
  };

  return {
    onKeyDown,
    activeItem,
  };
};
