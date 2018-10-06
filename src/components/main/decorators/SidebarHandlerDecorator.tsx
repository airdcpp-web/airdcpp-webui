import React from 'react';

//import History from 'utils/History';
import { Location } from 'history';


// A decorator for handling of sidebar
// This should be used with main layouts that are displayed only when socket is connected


export interface SidebarHandlerDecoratorProps {
  location: Location;
}

export interface SidebarHandlerDecoratorChildProps {
  location: Location;
  //sidebar: React.ReactNode;
  //sidebar: boolean;
  previousLocation?: Location;
}



import { /*parseRoutes,*/ RouteItem, isRouteActive } from 'routes/Routes';
//import Sidebar from 'routes/Sidebar/components/Sidebar';
//import { Location } from 'history';




const showSidebar = (  
  routes: RouteItem[],
  location: Location
) => {
  return !!routes.find(route => isRouteActive(route, location));
};

/*interface SidebarContainerProps {
  routes: RouteItem[]; 
  location: Location;
}

const SidebarContainer: React.SFC<SidebarContainerProps> = ({ routes, location }) => {
  const active = routes.find(route => isRouteActive(route, location));
  if (!active) {
    return null;
  }

  return (
    <Sidebar location={ location }>
      { parseRoutes(routes) }
    </Sidebar>
  );
};*/



export default function <PropsT>(
  Component: React.ComponentType<PropsT & SidebarHandlerDecoratorChildProps>,
  routes: RouteItem[]
) {
  class SidebarHandlerDecorator extends React.Component<PropsT & SidebarHandlerDecoratorProps> {
    previousLocation: Location | undefined;

    constructor(props: PropsT & SidebarHandlerDecoratorProps) {
      super(props);

      if (showSidebar(routes, this.props.location)) {
        // previousLocation must exist if overlays are present
        this.previousLocation = {
          ...this.props.location as Location,
          pathname: '/',
        };
      }
    } 

    /*componentDidMount() {
      if (showSidebar(routes, this.props.location)) {
        // previousLocation must exist if overlays are present
        this.previousLocation = this.props.location;
      }
    }*/

    UNSAFE_componentWillReceiveProps(nextProps: SidebarHandlerDecoratorProps) {
      // Save the return location for sidebar
      // Also save the location before opening modals as they shouldn't be used as
      // return locations
      if (showSidebar(routes, nextProps.location) /*|| History.getModalIds(nextProps.location)*/) {
        if (!this.previousLocation) {
          this.previousLocation = this.props.location;
        }
      } else {
        this.previousLocation = undefined;
      }
    }

    render() {
      /*let sidebar = false;
      if (showSidebar(routes, this.props.location)) {
        sidebar = true;
      }*/

      return (
        <Component 
          { ...this.props } 
          /*sidebar={ !this.previousLocation ? null : (
            <Sidebar location={ this.props.location }>
              { parseRoutes(routes) }
            </Sidebar>
          )} */ 
          previousLocation={ this.previousLocation }
        />
      );
    }
  }

  return SidebarHandlerDecorator;
}
