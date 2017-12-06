import React from 'react';
import { Route } from 'react-router';


const RouteWithSubRoutes = route => {
  const { path, exact, location, ...other } = route;
  return (
    <Route path={ path } exact={ exact } location={ location } render={ props => (
      <route.component { ...props } { ...other }/>
    ) }
    />
  );
};

export default RouteWithSubRoutes;