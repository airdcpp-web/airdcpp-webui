'use strict';
import React from 'react';

import Dropdown from 'components/semantic/Dropdown';
import DropdownSection from 'components/semantic/DropdownSection';
import Icon from 'components/semantic/Icon';
import SaveDecorator from '../decorators/SaveDecorator';


const MenuSection = ({ menuItems, advancedMenuItems, currentMenuItem, parentMenuItems, parent }) => (
  <div className="ui top-menu">
    <Dropdown 
      className="selection fluid" 
      caption={ parent.title }
      icon={ 'green ' + parent.icon }
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
      { saveButton }
      { message }
      { children }
    </div>
  </div>
);

export default SaveDecorator(TopMenuLayout, 'fluid');
