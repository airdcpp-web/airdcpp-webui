'use strict';
import React from 'react';

import Dropdown from 'components/semantic/Dropdown';
import DropdownSection from 'components/semantic/DropdownSection';
import Icon from 'components/semantic/Icon';


const MenuSection = ({ menuItems, advancedMenuItems, currentMenuItem, parentMenuItems, parent }) => (
  <div className="ui top-menu">
    <Dropdown 
      className="selection fluid" 
      caption={ parent.title }
      captionIcon={ 'green ' + parent.icon }
    >
      { parentMenuItems }
    </Dropdown>

    <Icon icon="large caret right"/>

    <Dropdown 
      className="selection fluid" 
      caption={ currentMenuItem.title }
    >
      <DropdownSection>
        { menuItems }
      </DropdownSection>
      <DropdownSection caption="Advanced">
        { advancedMenuItems }
      </DropdownSection>
    </Dropdown>
  </div>
);


const TopMenuLayout = ({ saveButton, children, contentClassname, message, ...other }) => (
  <div className="mobile">
    <MenuSection { ...other }/>
    <div id="setting-scroll-context" className={ contentClassname }>
      { React.cloneElement(saveButton, { className: 'fluid' }) }
      { message }
      { children }
    </div>
  </div>
);

export default TopMenuLayout;
