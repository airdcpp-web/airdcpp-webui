import * as React from 'react';

import { translate } from '@/utils/TranslationUtils';

import Dropdown from '@/components/semantic/Dropdown';
import MenuItemLink from '@/components/semantic/MenuItemLink';

import * as UI from '@/types/ui';

import Icon from '@/components/semantic/Icon';
import { BrowseHandler, DownloadLayoutProps } from '../types';
import IconConstants from '@/constants/IconConstants';

const appendBrowseItem = (
  menuItems: React.ReactNode[],
  handleBrowse: BrowseHandler,
  t: UI.TranslateF,
) => {
  if (!handleBrowse) {
    return menuItems;
  }

  return [
    ...menuItems,
    <MenuItemLink key="browse" onClick={handleBrowse}>
      {translate('Browse', t, UI.Modules.COMMON)}
      <Icon icon={IconConstants.BROWSE} />
    </MenuItemLink>,
  ];
};

export const MobileDownloadLayout: React.FC<DownloadLayoutProps> = ({
  menuItems,
  title,
  handleBrowse,
  t,
  children,
}) => (
  <div className="mobile layout">
    <Dropdown selection={true} caption={title}>
      {appendBrowseItem(menuItems, handleBrowse, t)}
    </Dropdown>
    <div className="ui segment main-content">{children}</div>
  </div>
);
