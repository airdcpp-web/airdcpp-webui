'use strict';
import React from 'react';

import Dropdown from 'components/semantic/Dropdown';
import SectionedDropdown from 'components/semantic/SectionedDropdown';
import MenuSection from 'components/semantic/MenuSection';
import Icon from 'components/semantic/Icon';


const SettingMenu = ({ menuItems, advancedMenuItems, currentMenuItem, parentMenuItems, parent }) => (
  <div className="ui top-menu">
    <Dropdown 
      className="selection fluid" 
      caption={ parent.title }
      captionIcon={ 'green ' + parent.icon }
    >
      { parentMenuItems }
    </Dropdown>

    <Icon icon="large caret right"/>

    <SectionedDropdown 
      className="selection fluid" 
      caption={ currentMenuItem.title }
    >
      <MenuSection>
        { menuItems }
      </MenuSection>
      <MenuSection caption="Advanced">
        { advancedMenuItems }
      </MenuSection>
    </SectionedDropdown>
  </div>
);


const TopMenuLayout = ({ saveButton, children, contentClassname, message, ...other }) => (
  <div className="mobile">
    <SettingMenu { ...other }/>
    <div id="setting-scroll-context" className={ contentClassname }>
      { !!saveButton && React.cloneElement(saveButton, { className: 'fluid' }) }
      { message }
      { children }
    </div>
  </div>
);

export default TopMenuLayout;
