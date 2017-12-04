'use strict';

import PropTypes from 'prop-types';

import React from 'react';

import History from 'utils/History';

import MainNavigationDecorator from 'decorators/menu/MainNavigationDecorator';
import IconPanel from './IconPanel';
import { matchPath } from 'react-router-dom';


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
    const { secondaryMenuItems, menuItemGetter } = this.props;
    return (
      <div id="side-menu">
        { secondaryMenuItems.length > 0 && (
          <div className="content navigation">
            <div className="ui labeled icon vertical small inverted menu">
              { secondaryMenuItems.map(menuItemGetter.bind(this, this.onClick, true)) }
            </div>
          </div>
        ) }
        <div className="ui divider"/>
        <IconPanel/>
      </div>
    );
  }
}

export default MainNavigationDecorator(SideMenu);
