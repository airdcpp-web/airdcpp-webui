import PropTypes from 'prop-types';
import React from 'react';

import MainNavigation from 'components/main/navigation/MainNavigationNormal';
import SideMenu from 'components/main/navigation/SideMenu';
import Sidebar from 'routes/Sidebar/components/Sidebar';
import SiteHeader from './SiteHeader';

import { configRoutes, mainRoutes, secondaryRoutes, parseRoutes } from 'routes/Routes';

import SidebarHandlerDecorator from './decorators/SidebarHandlerDecorator';

import 'normal.css';


class MainLayout extends React.Component {
  static propTypes = {
    sidebar: PropTypes.bool,
    location: PropTypes.object.isRequired,
  };

  render() {
    const { sidebar, className, location, previousLocation } = this.props;

    return (
      <div className={ className + ' pushable sidebar-context' } id="normal-layout">
        { sidebar && (
          <Sidebar location={ location }>
            { parseRoutes(secondaryRoutes) }
          </Sidebar>
        ) }
        <div className="pusher">
          <SiteHeader 
            content={ <MainNavigation location={ location }/> }
          />
          <div className="ui site-content">
            { parseRoutes([ ...mainRoutes, ...configRoutes ], previousLocation ? previousLocation : location) }
          </div>
        </div>
        <SideMenu location={ location }/>
      </div>
    );
  }
}

export default SidebarHandlerDecorator(MainLayout);