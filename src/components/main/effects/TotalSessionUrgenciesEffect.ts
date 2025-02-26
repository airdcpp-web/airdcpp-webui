import { useEffect, useState } from 'react';

import { appendToMap, maxUrgency, validateUrgencies } from '@/utils/UrgencyUtils';
import { RouteItem } from '@/routes/Routes';

import '@/mobile.css';

import * as UI from '@/types/ui';
import { useStoreApi } from '@/context/StoreContext';

const reduceMenuItemUrgency = (
  urgencyCountMap: UI.UrgencyCountMap,
  menuItem: RouteItem,
  store: UI.Store,
) => {
  if (!menuItem.unreadInfoStoreSelector) {
    return urgencyCountMap;
  }

  const urgencies = menuItem.unreadInfoStoreSelector(store).getTotalUrgencies();
  if (!urgencies) {
    return urgencyCountMap;
  }

  const max = maxUrgency(urgencies);
  if (max) {
    appendToMap(urgencyCountMap, max);
  }

  return urgencyCountMap;
};

const getTotalUrgencies = (routes: RouteItem[], store: UI.Store) => {
  return validateUrgencies(
    routes.reduce((prev, reduced) => reduceMenuItemUrgency(prev, reduced, store), {}),
  );
};

export const useTotalSessionUrgenciesEffect = (routes: RouteItem[]) => {
  const store = useStoreApi();
  const [urgencies, setUrgencies] = useState<UI.UrgencyCountMap | null>(
    getTotalUrgencies(routes, store.getState()),
  );

  useEffect(() => {
    setUrgencies(getTotalUrgencies(routes, store.getState()));
    const unsubscribe = routes.reduce(
      (reduced, item) => {
        if (!!item.unreadInfoStoreSelector) {
          reduced.push(
            store.subscribe(() => {
              setUrgencies(getTotalUrgencies(routes, store.getState()));
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
