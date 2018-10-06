import React from 'react';

import { Location } from 'history';

import { RouteItem, isRouteActive, HOME_URL } from 'routes/Routes';


// A decorator for handling of sidebar
// This should be used with main layouts that are displayed only when socket is connected

export interface SidebarHandlerDecoratorProps {
  location: Location;
}

export interface SidebarHandlerDecoratorChildProps {
  location: Location;
  previousLocation?: Location;
}

const showSidebar = (  
  routes: RouteItem[],
  location: Location
) => {
  return !!routes.find(route => isRouteActive(route, location));
};


export default function <PropsT>(
  Component: React.ComponentType<PropsT & SidebarHandlerDecoratorChildProps>,
  sidebarRoutes: RouteItem[]
) {
  class SidebarHandlerDecorator extends React.Component<PropsT & SidebarHandlerDecoratorProps> {
    previousLocation: Location | undefined;

    constructor(props: PropsT & SidebarHandlerDecoratorProps) {
      super(props);

      if (showSidebar(sidebarRoutes, this.props.location)) {
        // Accessing sidebar location with a direct link, use home as return location
        this.previousLocation = {
          ...this.props.location as Location,
          pathname: HOME_URL,
        };
      }
    }

    UNSAFE_componentWillReceiveProps(nextProps: SidebarHandlerDecoratorProps) {
      // Save the return location for sidebar
      if (showSidebar(sidebarRoutes, nextProps.location)) {
        if (!this.previousLocation) {
          this.previousLocation = this.props.location;
        }
      } else {
        this.previousLocation = undefined;
      }
    }

    render() {
      return (
        <Component 
          { ...this.props }
          previousLocation={ this.previousLocation }
        />
      );
    }
  }

  return SidebarHandlerDecorator;
}
