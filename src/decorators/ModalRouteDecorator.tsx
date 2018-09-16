import React from 'react';
import PropTypes from 'prop-types';
import { Route, RouterChildContext, match as RouteMatch, /*RouteComponentProps*/ } from 'react-router';
import { Location } from 'history';


const parseRoutePath = (match: RouteMatch<{}>, path: string) => {
  if (path[0] === '/') {
    return path;
  }

  return `${match.url}/${path}`;
};


export interface ModalRouteDecoratorProps {
  
}

export interface ModalRouteDecoratorChildProps {
  overlayId?: any;
}

const getLocationState = (location: Location, overlayId: any) => {
  if (location.state && location.state[overlayId]) {
    return location.state[overlayId];
  }

  return undefined;
};

export default function <PropsT>(
  Component: React.ComponentType<PropsT & ModalRouteDecoratorChildProps /*& RouteComponentProps<{}>*/>, 
  overlayId: any, 
  path: string
) {
  const ModalRouteDecorator: React.SFC<ModalRouteDecoratorProps & PropsT> = (
    props, 
    { router }: RouterChildContext<{}>
  ) => {
    const { match } = router.route;
    /*const state = getLocationState(location, overlayId);
    if (!state && Object.keys(match.params).length === 0) {
      return null;
    }*/
    
    return (
      <Route 
        path={ parseRoutePath(match, path) }
        render={ routeProps => {
          const state = getLocationState(routeProps.location, overlayId);
          if (!state && Object.keys(routeProps.match.params).length === 0) {
            return null;
          }

          return (
            <Component
              overlayId={ overlayId }
              { ...props }
              { ...routeProps.location.state[overlayId].data }
              { ...routeProps }
            />
          );
        } }
        { ...props }
      />
    );
  };

  ModalRouteDecorator.contextTypes = {
    router: PropTypes.object.isRequired,
  };

  return ModalRouteDecorator;
}