'use strict';
import React from 'react';
import classNames from 'classnames';

import LayoutHeader from 'components/semantic/LayoutHeader';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';


type SideMenuProps = Pick<SettingSectionChildProps, 'menuItems' | 'advancedMenuItems'>;

const SideChildSectionMenu: React.SFC<SideMenuProps> = ({ menuItems, advancedMenuItems }) => {
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

type TopMenuProps = Pick<SettingSectionChildProps, 'parentMenuItems'>;

const TopRootSectionMenu: React.SFC<TopMenuProps> = ({ parentMenuItems }) => (
  <div className="ui secondary pointing menu settings top-menu">
    { parentMenuItems }
  </div>
);

type ContentProps = Pick<SettingSectionChildProps, 'contentClassname' | 'currentMenuItem' | 'parent' | 'saveButton' | 'message'>;

const Content: React.SFC<ContentProps> = ({ contentClassname, currentMenuItem, parent, saveButton, children, message }) => (
  <div className={ classNames('thirteen wide column', contentClassname) }>
    <div className="ui segment">
      <LayoutHeader
        title={ currentMenuItem.title }
        icon={ classNames(parent.icon, 'green') }
        rightComponent={ saveButton }
      />
      <div className="options">
        { message }
        { children }
      </div>
    </div>
  </div>
);

const SideMenuLayout: React.SFC<SettingSectionChildProps> = ({ children, ...other }) => (
  <div className="full">
    <TopRootSectionMenu { ...other }/>
    <div 
      id="setting-scroll-context" 
      className="ui segment grid main"
    >
      <SideChildSectionMenu { ...other }/>
      <Content { ...other }>
        { children }
      </Content>
    </div>
  </div>
);

export default SideMenuLayout;
