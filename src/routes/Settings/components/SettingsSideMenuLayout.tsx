import * as React from 'react';
import classNames from 'classnames';

import LayoutHeader from '@/components/semantic/LayoutHeader';
import { SettingSectionLayoutProps } from '@/routes/Settings/types';
import { translateSettingSectionTitle } from './MenuItems';
import Icon from '@/components/semantic/Icon';

type SideMenuProps = Pick<SettingSectionLayoutProps, 'menu' | 'settingsT'>;

const SideChildSectionMenu: React.FC<SideMenuProps> = ({ menu, settingsT }) => {
  return (
    <div className="three wide column menu-column">
      <div className="ui vertical secondary menu" role="menu">
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
  <div className="ui secondary pointing menu settings top-menu" role="menu">
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
  <div className={classNames('thirteen wide column', contentClassname)}>
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
