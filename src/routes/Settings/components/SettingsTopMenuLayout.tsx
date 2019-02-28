'use strict';
import React from 'react';

import Dropdown from 'components/semantic/Dropdown';
import SectionedDropdown from 'components/semantic/SectionedDropdown';
import MenuSection from 'components/semantic/MenuSection';
import Icon from 'components/semantic/Icon';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';
import { translateSettingSectionTitle } from './MenuItems';



// tslint:disable-next-line:max-line-length
type TopSectionSelectionMenuProps = Pick<SettingSectionChildProps, 'menuItems' | 'currentMenuItem' | 'parent' | 'advancedMenuItems' | 'parentMenuItems' | 'settingsT'>;

const TopSectionSelectionMenu: React.FC<TopSectionSelectionMenuProps> = (
  { menuItems, advancedMenuItems, currentMenuItem, parentMenuItems, parent, settingsT }
) => (
  <div className="ui top-menu">
    <Dropdown 
      className="selection fluid" 
      caption={ translateSettingSectionTitle(parent!.title, settingsT) }
      captionIcon={ `green ${parent!.icon}` }
    >
      { parentMenuItems }
    </Dropdown>

    <Icon icon="large caret right"/>

    <SectionedDropdown 
      className="selection fluid" 
      caption={ translateSettingSectionTitle(currentMenuItem.title, settingsT) }
    >
      <MenuSection>
        { menuItems }
      </MenuSection>
      <MenuSection caption={ settingsT.translate('Advanced') }>
        { advancedMenuItems }
      </MenuSection>
    </SectionedDropdown>
  </div>
);


const TopMenuLayout: React.FC<SettingSectionChildProps> = (
  { saveButton, children, contentClassname, message, ...other }
) => (
  <div className="mobile">
    <TopSectionSelectionMenu { ...other }/>
    <div 
      id="setting-scroll-context" 
      className={ contentClassname }
    >
      { !!saveButton && React.cloneElement(saveButton, { className: 'fluid' }) }
      { message }
      { children }
    </div>
  </div>
);

export default TopMenuLayout;
