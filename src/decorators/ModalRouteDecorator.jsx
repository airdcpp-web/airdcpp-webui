import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router';


const parseRoutePath = (match, path) => {
  if (path[0] === '/') {
    return path;
  }

  return `${match.url}/${path}`;
};

export default function modalHandler(Component, overlayId, path) {
  const ModalRouteDecorator = (props, { router }) => {
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