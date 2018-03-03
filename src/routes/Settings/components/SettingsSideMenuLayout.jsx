'use strict';
import React from 'react';
import classNames from 'classnames';

import LayoutHeader from 'components/semantic/LayoutHeader';


const SideMenu = ({ menuItems, advancedMenuItems, menuItemToLink, parent }) => {
  return (
    <div className="three wide column menu-column">
      <div className="ui vertical secondary menu">
        { menuItems }
        { !!advancedMenuItems && (
          <div>
            <div className="item header">
							Advanced
            </div>
            <div className="menu">
              { advancedMenuItems }
            </div> 
          </div>
        ) }
      </div>
    </div>
  );
};

const TopMenu = ({ parentMenuItems }) => (
  <div className="ui secondary pointing menu settings top-menu">
    { parentMenuItems }
  </div>
);

const Content = ({ contentClassname, currentMenuItem, parent, saveButton, children, message }) => (
  <div className={ classNames('thirteen wide column', contentClassname) }>
    <div className="ui segment">
      <LayoutHeader
        title={ currentMenuItem.title }
        icon={ classNames(parent.icon, 'green') }
        component={ saveButton }
      />
      <div className="options">
        { message }
        { children }
      </div>
    </div>
  </div>
);


const SideMenuLayout = ({ children, ...other }) => (
  <div className="full">
    <TopMenu { ...other }/>
    <div 
      id="setting-scroll-context" 
      className="ui segment grid main"
    >
      <SideMenu { ...other }/>
      <Content { ...other }>
        { children }
      </Content>
    </div>
  </div>
);

export default SideMenuLayout;
