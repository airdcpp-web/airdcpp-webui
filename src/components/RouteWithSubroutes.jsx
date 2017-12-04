import React from 'react';
import { Route } from 'react-router';


const parseOverlayProps = (route, props) => {
  if (route.overlayId && props.location.state && props.location.state[route.overlayId]) {
    return {
      overlayId: route.overlayId,
      ...props.location.state[route.overlayId].data
    };
  }

  return {};
};

const RouteWithSubRoutes = route => {
  const { path, exact, location, childRoutes, ...other } = route;
  return (
    <Route path={ path } exact={ exact } location={ location } render={ props => (
      // pass the sub-routes down to keep nesting
      <route.component { ...props } { ...other } routes={ childRoutes } { ...parseOverlayProps(route, props) }/>
    ) }
    />
  );
};

export default RouteWithSubRoutes;