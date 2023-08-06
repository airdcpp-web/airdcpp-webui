import { useEffect, useState } from 'react';

import { appendToMap, maxUrgency, validateUrgencies } from 'utils/UrgencyUtils';

import 'mobile.css';

import * as UI from 'types/ui';

const reduceMenuItemUrgency = (
  urgencyCountMap: UI.UrgencyCountMap,
  menuItem: UI.RouteItem,
) => {
  if (!menuItem.unreadInfoStore) {
    return urgencyCountMap;
  }

  const urgencies = menuItem.unreadInfoStore.getTotalUrgencies();
  if (!urgencies) {
    return urgencyCountMap;
  }

  const max = maxUrgency(urgencies);
  if (max) {
    appendToMap(urgencyCountMap, max);
  }

  return urgencyCountMap;
};

const getTotalUrgencies = (routes: UI.RouteItem[]) => {
  return validateUrgencies(routes.reduce(reduceMenuItemUrgency, {}));
};

export const useTotalSessionUrgenciesEffect = (routes: UI.RouteItem[]) => {
  const [urgencies, setUrgencies] = useState<UI.UrgencyCountMap | null>(
    getTotalUrgencies(routes),
  );

  useEffect(() => {
    setUrgencies(getTotalUrgencies(routes));
    const unsubscribe = routes.reduce(
      (reduced, item) => {
        if (!!item.unreadInfoStore) {
          reduced.push(
            (item.unreadInfoStore as any).listen(() => {
              setUrgencies(getTotalUrgencies(routes));
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
