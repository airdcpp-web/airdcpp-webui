import { useEffect, useState } from 'react';

import { appendToMap, maxUrgency, validateUrgencies } from '@/utils/UrgencyUtils';
import { RouteItem } from '@/routes/Routes';

import * as UI from '@/types/ui';
import { useSessionStoreApi } from '@/context/SessionStoreContext';

const reduceMenuItemUrgency = (
  urgencyCountMap: UI.UrgencyCountMap,
  menuItem: RouteItem,
  sessionStore: UI.SessionStore,
) => {
  if (!menuItem.unreadInfoStoreSelector) {
    return urgencyCountMap;
  }

  const urgencies = menuItem.unreadInfoStoreSelector(sessionStore).getTotalUrgencies();
  if (!urgencies) {
    return urgencyCountMap;
  }

  const max = maxUrgency(urgencies);
  if (max) {
    appendToMap(urgencyCountMap, max);
  }

  return urgencyCountMap;
};

const getTotalUrgencies = (routes: RouteItem[], sessionStore: UI.SessionStore) => {
  return validateUrgencies(
    routes.reduce(
      (prev, reduced) => reduceMenuItemUrgency(prev, reduced, sessionStore),
      {},
    ),
  );
};

export const useTotalSessionUrgenciesEffect = (routes: RouteItem[]) => {
  const sessionStore = useSessionStoreApi();
  const [urgencies, setUrgencies] = useState<UI.UrgencyCountMap | null>(
    getTotalUrgencies(routes, sessionStore.getState()),
  );

  useEffect(() => {
    setUrgencies(getTotalUrgencies(routes, sessionStore.getState()));
    const unsubscribe = routes.reduce(
      (reduced, item) => {
        if (!!item.unreadInfoStoreSelector) {
          reduced.push(
            sessionStore.subscribe(() => {
              setUrgencies(getTotalUrgencies(routes, sessionStore.getState()));
            }),
          );
        }

        return reduced;
      },
      [] as Array<() => void>,
    );

    return () => unsubscribe.forEach((u) => u());
  }, []);

  return urgencies;
};
