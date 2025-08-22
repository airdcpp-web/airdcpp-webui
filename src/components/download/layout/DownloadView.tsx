import { useState } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { getParentPath } from '@/utils/FileUtils';
import { usingMobileLayout } from '@/utils/BrowserUtils';
import { toI18nKey } from '@/utils/TranslationUtils';

import ShareConstants from '@/constants/ShareConstants';
import FavoriteDirectoryConstants from '@/constants/FavoriteDirectoryConstants';

import MenuItemLink from '@/components/semantic/MenuItemLink';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { getDownloadSections, DownloadSection } from './sections';
import { BrowseHandler, PathDownloadHandler } from '../types';

import { MobileDownloadLayout } from './MobileDownloadLayout';
import { NormalDownloadLayout } from './NormalDownloadLayout';
import DataProviderDecorator from '@/decorators/DataProviderDecorator';

const toPanelId = (key: string) => `download-panel-${key}`;
const toTabId = (key: string) => `download-tab-${key}`;

export interface DownloadLayoutDataProps {
  sharePaths: API.GroupedPath[];
  favoritePaths: API.GroupedPath[];
}

export interface DownloadLayoutProps<
  ItemT extends UI.DownloadableItemInfo = UI.DownloadableItemInfo,
> {
  downloadHandler: PathDownloadHandler;
  handleBrowse: BrowseHandler;

  historyPaths: string[];
  itemInfo: ItemT;
}

const getMenuItem = (
  section: DownloadSection,
  activeSection: string,
  onClick: (key: string) => void,
  t: UI.TranslateF,
) => {
  const label = t(toI18nKey(section.key, UI.Modules.COMMON), section.name);
  return (
    <MenuItemLink
      key={section.key}
      onClick={() => onClick(section.key)}
      active={activeSection === section.key}
      id={toTabId(section.key)}
      role="tab"
      aria-controls={toPanelId(section.key)}
      aria-label={label}
    >
      <>
        {label}
        {!!section.list && <div className="ui small label">{section.list.length}</div>}
      </>
    </MenuItemLink>
  );
};

type Props<ItemT extends UI.DownloadableItemInfo = UI.DownloadableItemInfo> =
  DownloadLayoutProps<ItemT> & DownloadLayoutDataProps;

const DownloadLayout: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const [activeSectionKey, setActiveSectionKey] = useState('history');

  const sections = React.useMemo(() => {
    const { historyPaths, sharePaths, favoritePaths, itemInfo } = props;
    const dupePaths = itemInfo.dupe
      ? itemInfo.dupe.paths.map((path) => getParentPath(path))
      : [];

    return getDownloadSections({
      historyPaths,
      sharePaths,
      favoritePaths,
      dupePaths,
    });
  }, []);

  const activeSection = sections.find((s) => s.key === activeSectionKey);
  if (!activeSection) {
    return null;
  }

  const menuItems = sections.map((s) =>
    getMenuItem(s, activeSectionKey, setActiveSectionKey, t),
  );

  const Component = usingMobileLayout() ? MobileDownloadLayout : NormalDownloadLayout;

  return (
    <Component
      key={activeSection.key} // Ensure that section-specific data is refetched
      menuItems={menuItems}
      title={activeSection.name}
      handleBrowse={props.handleBrowse}
      t={t}
    >
      <div
        role="tabpanel"
        id={toPanelId(activeSection.key)}
        aria-labelledby={toTabId(activeSection.key)}
      >
        <activeSection.component t={t} downloadHandler={props.downloadHandler} />
      </div>
    </Component>
  );
};

const DownloadLayoutDecorated = DataProviderDecorator<
  DownloadLayoutProps,
  DownloadLayoutDataProps
>(DownloadLayout, {
  urls: {
    sharePaths: ShareConstants.GROUPED_ROOTS_GET_URL,
    favoritePaths: FavoriteDirectoryConstants.GROUPED_DIRECTORIES_URL,
  },
});

export { DownloadLayoutDecorated as DownloadLayout };
