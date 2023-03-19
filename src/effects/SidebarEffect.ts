import { useState, useEffect } from 'react';

import { Location } from 'history';

import { RouteItem, HOME_URL, isRouteActive } from 'routes/Routes';
import { RouteComponentProps } from 'react-router';

const showSidebar = (routes: RouteItem[], location: Location) => {
  return !!routes.find((route) => isRouteActive(route, location));
};

export const useSidebarEffect = (
  sidebarRoutes: RouteItem[],
  props: RouteComponentProps
) => {
  const [mainLayoutLocation, setMainLayoutLocation] = useState<Location | undefined>(
    undefined
  );

  useEffect(() => {
    if (showSidebar(sidebarRoutes, props.location)) {
      if (!mainLayoutLocation) {
        // Home layout is being used as a return URL if we are
        // accessing a sidebar location with a direct link
        setMainLayoutLocation({
          ...(props.location as Location),
          pathname: HOME_URL,
        });
      }
    } else {
      // Keep the previous location available
      setMainLayoutLocation(props.location);
    }
  }, [props.location]);

  return showSidebar(sidebarRoutes, props.location) ? mainLayoutLocation : undefined;
};
