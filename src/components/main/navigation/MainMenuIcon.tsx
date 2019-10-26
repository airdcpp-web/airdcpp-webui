import React, { useEffect, useState, memo } from 'react';

import { MenuIcon } from 'components/menu';

import { appendToMap, maxUrgency, validateUrgencies } from 'utils/UrgencyUtils';
import { RouteItem } from 'routes/Routes';

import 'mobile.css';

import * as UI from 'types/ui';


const reduceMenuItemUrgency = (urgencyCountMap: UI.UrgencyCountMap, menuItem: RouteItem) => {
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

const getTotalUrgencies = (routes: RouteItem[]) => {
  return validateUrgencies(routes.reduce(reduceMenuItemUrgency, {}));
};

const useTotalSessionUrgenciesEffect = (routes: RouteItem[]) => {
  const [ urgencies, setUrgencies ] = useState<UI.UrgencyCountMap | null>(getTotalUrgencies(routes));

  useEffect(
    () => {
      setUrgencies(getTotalUrgencies(routes));
      const unsubscribe = routes.reduce(
        (reduced, item) => {
          if (!!item.unreadInfoStore) {
            reduced.push(item.unreadInfoStore.listen(() => {
              setUrgencies(getTotalUrgencies(routes));
            }));
          }

          return reduced;
        },
        [] as Array<() => void>
      );

      return () => unsubscribe.forEach(u => u());
    },
    []
  );

  return urgencies;
};



interface MainMenuIconProps {
  onClickMenu: (evt: React.SyntheticEvent<any>) => void;
  routes: RouteItem[];
}

// Main menu icon showing a colored label based on the urgencies counted from all session items
const MainMenuIcon: React.FC<MainMenuIconProps> = memo(props => {
  const urgencies = useTotalSessionUrgenciesEffect(props.routes);

  const { onClickMenu } = props;
  return (
    <div className="right">
      <MenuIcon 
        urgencies={ urgencies }
        onClick={ onClickMenu }
        className="item"
      />
    </div>
  );
});

export { MainMenuIcon };
