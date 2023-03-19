import * as React from 'react';

import Dropdown from 'components/semantic/Dropdown';
import SectionedDropdown from 'components/semantic/SectionedDropdown';
import MenuSection from 'components/semantic/MenuSection';
import Icon from 'components/semantic/Icon';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';
import { translateSettingSectionTitle } from './MenuItems';

// eslint-disable-next-line max-len
type TopSectionSelectionMenuProps = Pick<
  SettingSectionChildProps,
  | 'menuItems'
  | 'currentMenuItem'
  | 'parent'
  | 'advancedMenuItems'
  | 'parentMenuItems'
  | 'settingsT'
>;

const TopSectionSelectionMenu: React.FC<TopSectionSelectionMenuProps> = ({
  menuItems,
  advancedMenuItems,
  currentMenuItem,
  parentMenuItems,
  parent,
  settingsT,
}) => (
  <div className="ui top-menu">
    <Dropdown
      selection={true}
      caption={translateSettingSectionTitle(parent!.title, settingsT)}
      captionIcon={`green ${parent!.icon}`}
    >
      {parentMenuItems}
    </Dropdown>

    <Icon icon="caret right" size="large" />

    <SectionedDropdown
      selection={true}
      caption={translateSettingSectionTitle(currentMenuItem.title, settingsT)}
    >
      <MenuSection>{menuItems}</MenuSection>
      <MenuSection caption={settingsT.translate('Advanced')}>
        {advancedMenuItems}
      </MenuSection>
    </SectionedDropdown>
  </div>
);

const TopMenuLayout: React.FC<SettingSectionChildProps> = ({
  saveButton,
  children,
  contentClassname,
  message,
  ...other
}) => (
  <div className="mobile">
    <TopSectionSelectionMenu {...other} />
    <div id="setting-scroll-context" className={contentClassname}>
      {!!saveButton && React.cloneElement(saveButton, { className: 'fluid' })}
      <div className="options">
        {message}
        {children}
      </div>
    </div>
  </div>
);

export default TopMenuLayout;
