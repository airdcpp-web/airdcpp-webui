import * as React from 'react';
import classNames from 'classnames';

import LayoutHeader from '@/components/semantic/LayoutHeader';
import { SettingSectionLayoutProps } from '@/routes/Settings/types';
import { translateSettingSectionTitle } from './MenuItems';
import Icon from '@/components/semantic/Icon';

// Define a static ID for the content panel so tabs can control it.
const CONTENT_PANEL_ID = 'settings-content-panel';

type SideMenuProps = Pick<
  SettingSectionLayoutProps,
  'menu' | 'settingsT' | 'selectedRootMenuItem'
>;

const SideChildSectionMenu: React.FC<SideMenuProps> = ({
  menu,
  settingsT,
  selectedRootMenuItem,
}) => {
  // The label should reflect the currently selected top-level tab for context.
  const sideMenuLabel = `${translateSettingSectionTitle(selectedRootMenuItem.title, settingsT)} sections`;
  return (
    <div className="three wide column menu-column">
      <div
        className="ui vertical secondary menu"
        role="tablist"
        aria-label={sideMenuLabel}
      >
        {/* The items passed in menu.childMenuItems should have role="tab" */}
        {menu.childMenuItems}
        {!!menu.childAdvancedMenuItems && (
          <div>
            <div className="item header">{settingsT.translate('Advanced')}</div>
            <div className="menu">{menu.childAdvancedMenuItems}</div>
          </div>
        )}
      </div>
    </div>
  );
};

type TopMenuProps = Pick<SettingSectionLayoutProps, 'menu'>;

const TopRootSectionMenu: React.FC<TopMenuProps> = ({ menu }) => (
  // This is the primary tab list.
  <div
    className="ui secondary pointing menu settings top-menu"
    role="tablist"
    aria-label="Setting categories"
  >
    {/* The items passed in menu.rootMenuItems should have role="tab" */}
    {menu.rootMenuItems}
  </div>
);

type ContentProps = React.PropsWithChildren<
  Pick<
    SettingSectionLayoutProps,
    | 'contentClassname'
    | 'selectedRootMenuItem'
    | 'selectedChildMenuItem'
    | 'getSaveButton'
    | 'message'
    | 'settingsT'
  >
>;

const Content: React.FC<ContentProps> = ({
  contentClassname,
  selectedChildMenuItem,
  selectedRootMenuItem,
  getSaveButton,
  children,
  message,
  settingsT,
}) => (
  <div
    id={CONTENT_PANEL_ID}
    className={classNames('thirteen wide column', contentClassname)}
    role="tabpanel"
  >
    <div className="ui segment">
      <LayoutHeader
        title={translateSettingSectionTitle(selectedChildMenuItem.title, settingsT)}
        icon={<Icon color="green" icon={selectedRootMenuItem.icon} />}
        rightComponent={getSaveButton()}
      />
      <div className="options">
        {message}
        {children}
      </div>
    </div>
  </div>
);

const SideMenuLayout: React.FC<SettingSectionLayoutProps> = ({ children, ...other }) => (
  <div className="full">
    <TopRootSectionMenu {...other} />
    <div id="setting-scroll-context" className="ui segment grid main">
      <SideChildSectionMenu {...other} />
      <Content {...other}>{children}</Content>
    </div>
  </div>
);

export default SideMenuLayout;
