import PropTypes from 'prop-types';
import React from 'react';

import MainNavigation from 'components/main/navigation/MainNavigationNormal';
import RouteWithSubRoutes from 'components/RouteWithSubRoutes';
import SideMenu from 'components/main/navigation/SideMenu';
import Sidebar from 'routes/Sidebar/components/Sidebar';
import SiteHeader from './SiteHeader';

import SidebarHandlerDecorator from './decorators/SidebarHandlerDecorator';

import 'normal.css';


class MainLayout extends React.Component {
  static propTypes = {
    sidebar: PropTypes.bool,
    location: PropTypes.object.isRequired,
  };

  render() {
    const { sidebar, className, location, mainRoutes, secondaryRoutes, previousLocation } = this.props;

    return (
      <div className={ className + ' pushable sidebar-context' } id="normal-layout">
        { sidebar && (
          <Sidebar location={ location }>
            { secondaryRoutes.map((route, i) => (
              <RouteWithSubRoutes key={ route.path } { ...route }/>
            )) }
          </Sidebar>
        ) }
        <div className="pusher">
          <SiteHeader 
            content={ <MainNavigation location={ location }/> }
          />
          <div className="ui site-content">
            { mainRoutes.map((route, i) => (
              <RouteWithSubRoutes key={ route.path } { ...route } location={ previousLocation ? previousLocation : location }/>
            )) }
          </div>
        </div>
        <SideMenu location={ location }/>
      </div>
    );
  }
}

export default SidebarHandlerDecorator(MainLayout);