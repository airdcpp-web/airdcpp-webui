import React from 'react';

import { Location } from 'history';

import { RouteItem, isRouteActive, HOME_URL } from 'routes/Routes';


// A decorator for handling of sidebar
// This should be used with main layouts that are displayed only when socket is connected


export interface SidebarStateProps {
  sidebarActive: boolean;
}

export const SidebarStateContext = React.createContext<boolean>(false);


/*export function withSidebarState<PropsT extends object>(
  Component: React.ComponentClass<PropsT & SidebarStateProps>
) {
  interface Internal { forwardedRef: React.Ref<PropsT>; }

  const WithSidebarState = (props: PropsT & Internal) => {
    const {
      forwardedRef,
      ...otherTmp
    } = props as Internal;

    const other = otherTmp as PropsT & SidebarStateProps;

    return (
      <SidebarStateContext.Consumer>
        { context => <Component ref={ forwardedRef as any } { ...other } sidebarActive={ context! }/> }
      </SidebarStateContext.Consumer>
    );
  };

  return React.forwardRef<PropsT>((props, ref) => {
    return <WithSidebarState { ...props } forwardedRef={ ref! } />;
  });

}*/

export function withSidebarState<PropsT>(Component: React.ComponentType<PropsT & SidebarStateProps>) {
  return (props: PropsT) => {
    return (
      <SidebarStateContext.Consumer>
        { context => <Component {...props} sidebarActive={ context } /> }
      </SidebarStateContext.Consumer>
    );
  };
}


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
        <SidebarStateContext.Provider value={ !!this.previousLocation }>
          <Component 
            { ...this.props }
            previousLocation={ this.previousLocation }
          />
        </SidebarStateContext.Provider>
      );
    }
  }

  return SidebarHandlerDecorator;
}
