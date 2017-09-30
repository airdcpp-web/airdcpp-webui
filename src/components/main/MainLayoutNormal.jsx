import PropTypes from 'prop-types';
import React from 'react';

import MainNavigation from 'components/main/navigation/MainNavigationNormal';
import SideMenu from 'components/main/navigation/SideMenu';
import SiteHeader from './SiteHeader';

import OverlayHandlerDecorator from './decorators/OverlayHandlerDecorator';

import 'normal.css';


class MainLayout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    sidebar: PropTypes.node,
    location: PropTypes.object.isRequired,
  };

  render() {
    const { children, sidebar } = this.props;

    return (
      <div className={ this.props.className + ' sidebar-context' } id="normal-layout">
        { sidebar }
        <div className="pusher">
          <SiteHeader 
            content={ <MainNavigation/> }
          />
          <div className="ui site-content">
            { children }
          </div>
        </div>
        <SideMenu location={ this.props.location }/>
      </div>
    );
  }
}

export default OverlayHandlerDecorator(MainLayout);