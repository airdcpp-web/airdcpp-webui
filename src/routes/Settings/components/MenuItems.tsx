import RouterMenuItemLink from '@/components/semantic/RouterMenuItemLink';

import * as UI from '@/types/ui';
import { ChildSectionType, RootSectionType, SectionBase } from '../types';
import { Location } from 'react-router';

export const sectionToUrl = (section: SectionBase, parent?: RootSectionType) => {
  if (typeof parent === 'object') {
    return `/settings/${parent.url}/${section.url}`;
  }

  return `/settings/${section.url}`;
};

export const translateSettingSectionTitle = (
  title: string,
  settingsT: UI.ModuleTranslator,
) => {
  return settingsT.translate(title, [UI.SubNamespaces.NAVIGATION]);
};

const menuItemToLinkComponent = (
  url: string,
  menuItemInfo: SectionBase,
  settingsT: UI.ModuleTranslator,
  { hasAccess }: UI.AuthenticatedSession,
) => {
  if (menuItemInfo.access && !hasAccess(menuItemInfo.access)) {
    return null;
  }

  return (
    <RouterMenuItemLink
      key={url}
      url={url}
      icon={'icon' in menuItemInfo ? `green ${menuItemInfo.icon}` : null}
    >
      {translateSettingSectionTitle(menuItemInfo.title, settingsT)}
    </RouterMenuItemLink>
  );
};

export const rootMenuItemToLinkComponent = (
  rootMenuItem: RootSectionType,
  settingsT: UI.ModuleTranslator,
  location: Location,
  session: UI.AuthenticatedSession,
) => {
  // Browsing is smoother when the child page is loaded directly
  // Don't use the child URL for currently active parent so that the route is detected as active correctly
  let url = sectionToUrl(rootMenuItem);
  if (rootMenuItem.menuItems && !location.pathname.startsWith(url)) {
    url = sectionToUrl(rootMenuItem.menuItems[0], rootMenuItem);
  }

  return menuItemToLinkComponent(url, rootMenuItem, settingsT, session);
};

export const childMenuItemToLinkComponent = (
  childMenuItem: ChildSectionType,
  parent: RootSectionType | undefined,
  settingsT: UI.ModuleTranslator,
  session: UI.AuthenticatedSession,
) => {
  const url = sectionToUrl(childMenuItem, parent);
  return menuItemToLinkComponent(url, childMenuItem, settingsT, session);
};

export const findMainSection = (
  mainSection: string | undefined,
  rootMenuItems: RootSectionType[],
) => {
  const item = rootMenuItems.find((rootMenuItem) => rootMenuItem.url === mainSection);
  return item || rootMenuItems[0];
};

export const findChildSection = (
  childSection: string | undefined,
  mainSection: RootSectionType,
) => {
  const item = [...mainSection.menuItems, ...(mainSection.advancedMenuItems || [])].find(
    (childMenuItem) => childMenuItem.url === childSection,
  );

  return item || mainSection.menuItems[0];
};
