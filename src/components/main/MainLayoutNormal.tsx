import React from 'react';

import MainNavigation from 'components/main/navigation/MainNavigationNormal';
import SideMenu from 'components/main/navigation/SideMenu';
import SiteHeader from 'components/main/SiteHeader';

import { configRoutes, mainRoutes, secondaryRoutes, parseRoutes } from 'routes/Routes';

import SidebarHandlerDecorator, { 
  SidebarHandlerDecoratorChildProps 
} from 'components/main/decorators/SidebarHandlerDecorator';

import 'normal.css';
import Sidebar from 'routes/Sidebar/components/Sidebar';



interface MainLayoutProps {
  className?: string;
}

class MainLayout extends React.Component<MainLayoutProps & SidebarHandlerDecoratorChildProps> {
  /*static propTypes = {
    sidebar: PropTypes.bool,
    location: PropTypes.object.isRequired,
  };*/

  render() {
    const { className, location, previousLocation } = this.props;

    return (
      <div 
        className={ className + ' pushable sidebar-context' } 
        id="normal-layout"
      >
        <Sidebar 
          location={ location }
          routes={ secondaryRoutes }
          previousLocation={ previousLocation }
        />
        <div className="pusher">
          <SiteHeader>
            <MainNavigation/>
          </SiteHeader>
          <div className="ui site-content">
            { parseRoutes([ ...mainRoutes, ...configRoutes ], !!previousLocation ? previousLocation : location) }
          </div>
        </div>
        <SideMenu 
          location={ location }
          previousLocation={ previousLocation }
        />
      </div>
    );
  }
}

export default SidebarHandlerDecorator<MainLayoutProps>(MainLayout, secondaryRoutes);