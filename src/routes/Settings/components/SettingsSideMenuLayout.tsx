import * as React from 'react';
import classNames from 'classnames';

import LayoutHeader from 'components/semantic/LayoutHeader';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';
import { translateSettingSectionTitle } from './MenuItems';
import Icon from 'components/semantic/Icon';

type SideMenuProps = Pick<
  SettingSectionChildProps,
  'menuItems' | 'advancedMenuItems' | 'settingsT'
>;

const SideChildSectionMenu: React.FC<SideMenuProps> = ({
  menuItems,
  advancedMenuItems,
  settingsT,
}) => {
  return (
    <div className="three wide column menu-column">
      <div className="ui vertical secondary menu">
        {menuItems}
        {!!advancedMenuItems && (
          <div>
            <div className="item header">{settingsT.translate('Advanced')}</div>
            <div className="menu">{advancedMenuItems}</div>
          </div>
        )}
      </div>
    </div>
  );
};

type TopMenuProps = Pick<SettingSectionChildProps, 'parentMenuItems'>;

const TopRootSectionMenu: React.FC<TopMenuProps> = ({ parentMenuItems }) => (
  <div className="ui secondary pointing menu settings top-menu">{parentMenuItems}</div>
);

// eslint-disable-next-line max-len
type ContentProps = React.PropsWithChildren<
  Pick<
    SettingSectionChildProps,
    | 'contentClassname'
    | 'currentMenuItem'
    | 'parent'
    | 'saveButton'
    | 'message'
    | 'settingsT'
  >
>;

const Content: React.FC<ContentProps> = ({
  contentClassname,
  currentMenuItem,
  parent,
  saveButton,
  children,
  message,
  settingsT,
}) => (
  <div className={classNames('thirteen wide column', contentClassname)}>
    <div className="ui segment">
      <LayoutHeader
        title={translateSettingSectionTitle(currentMenuItem.title, settingsT)}
        icon={<Icon color="green" icon={parent!.icon} />}
        rightComponent={saveButton}
      />
      <div className="options">
        {message}
        {children}
      </div>
    </div>
  </div>
);

const SideMenuLayout: React.FC<SettingSectionChildProps> = ({ children, ...other }) => (
  <div className="full">
    <TopRootSectionMenu {...other} />
    <div id="setting-scroll-context" className="ui segment grid main">
      <SideChildSectionMenu {...other} />
      <Content {...other}>{children}</Content>
    </div>
  </div>
);

export default SideMenuLayout;
