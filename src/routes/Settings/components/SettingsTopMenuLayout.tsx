import * as React from 'react';

import Dropdown from 'components/semantic/Dropdown';
import SectionedDropdown from 'components/semantic/SectionedDropdown';
import MenuSection from 'components/semantic/MenuSection';
import Icon from 'components/semantic/Icon';
import { SettingSectionLayoutProps } from 'routes/Settings/types';
import { translateSettingSectionTitle } from './MenuItems';

type TopSectionSelectionMenuProps = Pick<
  SettingSectionLayoutProps,
  'selectedRootMenuItem' | 'selectedChildMenuItem' | 'menu' | 'settingsT'
>;

const TopSectionSelectionMenu: React.FC<TopSectionSelectionMenuProps> = ({
  selectedChildMenuItem,
  menu,
  selectedRootMenuItem,
  settingsT,
}) => (
  <div className="ui top-menu">
    <Dropdown
      selection={true}
      caption={translateSettingSectionTitle(selectedRootMenuItem.title, settingsT)}
      captionIcon={`green ${selectedRootMenuItem.icon}`}
    >
      {menu.rootMenuItems}
    </Dropdown>

    <Icon icon="caret right" size="large" />

    <SectionedDropdown
      selection={true}
      caption={translateSettingSectionTitle(selectedChildMenuItem.title, settingsT)}
    >
      <MenuSection>{menu.childMenuItems}</MenuSection>
      <MenuSection caption={settingsT.translate('Advanced')}>
        {menu.childAdvancedMenuItems}
      </MenuSection>
    </SectionedDropdown>
  </div>
);

const TopMenuLayout: React.FC<SettingSectionLayoutProps> = ({
  getSaveButton,
  children,
  contentClassname,
  settingsT,
  message,
  ...other
}) => (
  <div className="mobile">
    <TopSectionSelectionMenu settingsT={settingsT} {...other} />
    <div id="setting-scroll-context" className={contentClassname}>
      {getSaveButton('fluid')}
      <div className="options">
        {message}
        {children}
      </div>
    </div>
  </div>
);

export default TopMenuLayout;
