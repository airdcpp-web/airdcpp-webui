'use strict';

import PropTypes from 'prop-types';
import React from 'react';

import History from 'utils/History';

import IconPanel from './IconPanel';
import { matchPath } from 'react-router-dom';
import { secondaryRoutes, parseMenuItems } from 'routes/Routes';


class SideMenu extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  onClick = (url, evt) => {
    evt.preventDefault();

    const isActive = matchPath(this.props.location.pathname, {
      path: url,
    });

    if (isActive) {
      History.replaceSidebarData(this.props.location, { close: true });
    } else {
      History.pushSidebar(this.props.location, url);
    }
  };

  render() {
    const menuItems = parseMenuItems(secondaryRoutes, this.onClick);
    return (
      <div id="side-menu">
        { menuItems.length > 0 && (
          <div className="content navigation">
            <div className="ui labeled icon vertical small inverted menu">
              { menuItems }
            </div>
          </div>
        ) }
        <div className="ui divider"/>
        <IconPanel/>
      </div>
    );
  }
}

export default SideMenu;
