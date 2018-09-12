import React from 'react';
import PropTypes from 'prop-types';
import { Route, RouterChildContext, match } from 'react-router';


const parseRoutePath = (match: match<{}>, path: string) => {
  if (path[0] === '/') {
    return path;
  }

  return `${match.url}/${path}`;
};


export interface ModalRouteDecoratorProps {
 // overlayId: any;
}

export interface ModalRouteDecoratorChildProps {
  overlayId: any;
}

export default function <PropsT>(
  Component: React.ComponentType<PropsT & ModalRouteDecoratorChildProps>, 
  overlayId: any, 
  path: string
) {
  const ModalRouteDecorator: React.SFC<ModalRouteDecoratorProps & PropsT> = (props, { router }: RouterChildContext<{}>) => {
    const { location, match } = router.route;
    if (!location.state || !location.state[overlayId]) {
      return null;
    }
    
    return (
      <Route 
        path={ parseRoutePath(match, path) }
        render={ routeProps => {
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