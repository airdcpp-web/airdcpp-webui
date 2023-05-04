import { useState, useEffect } from 'react';
import { Location } from 'react-router-dom';

import { RouteItem, HOME_URL, isRouteActive } from 'routes/Routes';

const showSidebar = (routes: RouteItem[], location: Location) => {
  return !!routes.find((route) => isRouteActive(route, location));
};

export const useSidebarEffect = (sidebarRoutes: RouteItem[], location: Location) => {
  const [mainLayoutLocation, setMainLayoutLocation] = useState<Location | undefined>(
    undefined
  );

  useEffect(() => {
    if (showSidebar(sidebarRoutes, location)) {
      if (!mainLayoutLocation) {
        // Home layout is being used as a return URL if we are
        // accessing a sidebar location with a direct link
        setMainLayoutLocation({
          ...(location as Location),
          pathname: HOME_URL,
        });
      }
    } else {
      // Keep the previous location available
      setMainLayoutLocation(location);
    }
  }, [location]);

  const show = showSidebar(sidebarRoutes, location);
  return show ? mainLayoutLocation : undefined;
};
