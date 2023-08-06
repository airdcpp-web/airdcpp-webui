import { useState, useLayoutEffect } from 'react';
import { Location, useLocation } from 'react-router-dom';
import { HOME_URL } from 'routes/Home';

import { isRouteActive } from 'routes/Routes';

import * as UI from 'types/ui';

const showSidebar = (routes: UI.RouteItem[], location: Location) => {
  return !!routes.find((route) => isRouteActive(route, location));
};

/*const renderOld = (location: Location) => {
  const matches = matchRoutes([...mainRoutes, ...configRoutes], location);
  const renderOutput = renderMatches(matches);
  return renderOutput;
};*/

interface PreviousMainLayout {
  children: React.ReactNode;
  location: Location;
}

export const useSidebarEffect = (
  sidebarRoutes: UI.RouteItem[],
  children: React.ReactNode,
) => {
  const location = useLocation();
  const [mainLayout, setMainLayout] = useState<PreviousMainLayout | undefined>(undefined);

  useLayoutEffect(() => {
    if (showSidebar(sidebarRoutes, location)) {
      if (!mainLayout) {
        // Home layout is being used as a return URL if we are
        // accessing a sidebar location with a direct link
        const previousLocation = {
          ...(location as Location),
          pathname: HOME_URL,
        };

        setMainLayout({
          location: previousLocation,
          children: null,
        });
      }
    } else {
      // Keep the previous location available
      setMainLayout({
        location,
        children,
      });
    }
  }, [location]);

  const show = showSidebar(sidebarRoutes, location);
  return show ? mainLayout : undefined;
};
