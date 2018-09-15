//import PropTypes from 'prop-types';
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import MainNavigation from 'components/main/navigation/MainNavigationNormal';
import SideMenu from 'components/main/navigation/SideMenu';
import Sidebar from 'routes/Sidebar/components/Sidebar';
import SiteHeader from 'components/main/SiteHeader';

import { configRoutes, mainRoutes, secondaryRoutes, parseRoutes, RouteItem } from 'routes/Routes';

import SidebarHandlerDecorator, { 
  SidebarHandlerDecoratorChildProps 
} from 'components/main/decorators/SidebarHandlerDecorator';

import 'normal.css';


const toIndexRedirect = (route: RouteItem) => (
  <Route
    key={ route.path }
    path={ route.path }
    render={ () => (
      <Redirect
        to="/"
      />
    ) }
  />
);


interface MainLayoutProps {
  className?: string;
}

class MainLayout extends React.Component<MainLayoutProps & SidebarHandlerDecoratorChildProps> {
  /*static propTypes = {
    sidebar: PropTypes.bool,
    location: PropTypes.object.isRequired,
  };*/

  render() {
    const { sidebar, className, location, previousLocation } = this.props;

    return (
      <div className={ className + ' pushable sidebar-context' } id="normal-layout">
        { sidebar ? (
          <Sidebar location={ location }>
            { parseRoutes(secondaryRoutes) }
          </Sidebar>
        ) : (
          <div>
            {/* Sidebar locations without the correct history data won't work, redirect to index */}
            { secondaryRoutes.map(toIndexRedirect) }
          </div>
        ) }
        <div className="pusher">
          <SiteHeader>
            <MainNavigation/>
          </SiteHeader>
          <div className="ui site-content">
            { parseRoutes([ ...mainRoutes, ...configRoutes ], !!previousLocation ? previousLocation : location) }
          </div>
        </div>
        <SideMenu location={ location }/>
      </div>
    );
  }
}

export default SidebarHandlerDecorator<MainLayoutProps>(MainLayout);