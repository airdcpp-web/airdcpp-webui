import { useState } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { getParentPath } from 'utils/FileUtils';
import { useMobileLayout } from 'utils/BrowserUtils';
import { toI18nKey } from 'utils/TranslationUtils';

import MenuItemLink from 'components/semantic/MenuItemLink';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { getDownloadSections, DownloadSection } from './sections';
import { BrowseHandler, PathDownloadHandler } from '../types';

import { MobileDownloadLayout } from './MobileDownloadLayout';
import { NormalDownloadLayout } from './NormalDownloadLayout';

export interface DownloadDataProps<
  ItemT extends UI.DownloadableItemInfo = UI.DownloadableItemInfo
> {
  sharePaths: API.GroupedPath[];
  favoritePaths: API.GroupedPath[];
  historyPaths: string[];
  itemInfo: ItemT;
}

export interface DownloadLayoutProps<
  ItemT extends UI.DownloadableItemInfo = UI.DownloadableItemInfo
> extends DownloadDataProps<ItemT> {
  downloadHandler: PathDownloadHandler;
  handleBrowse: BrowseHandler;
}

const getMenuItem = (
  section: DownloadSection,
  activeSection: string,
  onClick: (key: string) => void,
  t: UI.TranslateF
) => (
  <MenuItemLink
    key={section.key}
    onClick={() => onClick(section.key)}
    active={activeSection === section.key}
  >
    <>
      {t(toI18nKey(section.key, UI.Modules.COMMON), section.name)}
      {!!section.list && (
        <div className="ui small right label">{section.list.length}</div>
      )}
    </>
  </MenuItemLink>
);

export const DownloadLayout: React.FC<DownloadLayoutProps> = (props) => {
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
    getMenuItem(s, activeSectionKey, setActiveSectionKey, t)
  );

  const Component = useMobileLayout() ? MobileDownloadLayout : NormalDownloadLayout;
  return (
    <Component
      key={activeSection.key} // Ensure that section-specific data is refetched
      menuItems={menuItems}
      title={activeSection.name}
      handleBrowse={props.handleBrowse}
      t={t}
    >
      <activeSection.component t={t} downloadHandler={props.downloadHandler} />
    </Component>
  );
};
