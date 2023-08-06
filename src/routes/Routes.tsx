import RouterMenuItemLink from 'components/semantic/RouterMenuItemLink';

import LoginActions from 'actions/reflux/LoginActions';
import LoginStore from 'stores/LoginStore';
import IconConstants from 'constants/IconConstants';

import * as UI from 'types/ui';

import { Trans } from 'react-i18next';
import { textToI18nKey } from 'utils/TranslationUtils';
import { matchPath, Location, RouteObject } from 'react-router-dom';

import { HomeRoutes } from './Home';
import { QueueRoutes } from './Queue';
import { SearchRoutes } from './Search';
import { TransferRoutes } from './Transfers';
import { FavoriteHubRoutes } from './FavoriteHubs';
import { ShareRoutes } from './Share';
import { SettingRoutes } from './Settings';
import { FilelistRoutes } from './Sidebar/routes/Filelists';
import { MessageRoutes } from './Sidebar/routes/Messages';
import { HubRoutes } from './Sidebar/routes/Hubs';
import { FileRoutes } from './Sidebar/routes/Files';
import { EventRoutes } from './Sidebar/routes/Events';

export const mainRoutes: UI.RouteItem[] = [
  HomeRoutes,
  QueueRoutes,
  SearchRoutes,
  TransferRoutes,
];

export const configRoutes = [FavoriteHubRoutes, ShareRoutes, SettingRoutes];

export const secondaryRoutes: UI.RouteItem[] = [
  HubRoutes,
  MessageRoutes,
  FilelistRoutes,
  FileRoutes,
  EventRoutes,
];

const onClickLogout: UI.RouteItemClickHandler = (path, e) => {
  e.preventDefault();
  LoginActions.logout();
};

export const logoutItem: UI.RouteItem = {
  icon: IconConstants.LOGOUT,
  path: 'logout',
  title: 'Logout',
  className: 'logout',
  onClick: onClickLogout,
};

const menuItemClickHandler = (
  onClick: UI.RouteItemClickHandler | undefined,
  route: UI.RouteItem,
) => {
  if (!!onClick || !!route.onClick) {
    return (evt: any) =>
      onClick ? onClick(route.path, evt) : route.onClick!(route.path, evt);
  }

  return undefined;
};

export const parseMenuItem = (
  route: UI.RouteItem,
  onClick: UI.RouteItemClickHandler | undefined = undefined,
  showIcon: boolean | undefined = true,
) => {
  const { title, icon, unreadInfoStore, path, className } = route;
  return (
    <RouterMenuItemLink
      key={path}
      url={path}
      className={className}
      icon={showIcon ? icon + ' navigation' : null}
      onClick={menuItemClickHandler(onClick, route)}
      unreadInfoStore={unreadInfoStore}
    >
      <Trans i18nKey={textToI18nKey(title, UI.SubNamespaces.NAVIGATION)}>{title}</Trans>
    </RouterMenuItemLink>
  );
};

const filterItem = (item: UI.RouteItem) =>
  !item.access || LoginStore.hasAccess(item.access);

export const parseRoutes = (routes: UI.RouteItem[]): RouteObject[] => {
  return routes
    .filter((route) => !!route.lazy)
    .map((route, i) => {
      const { path, matchPath, ...other } = route;
      const routePath = `${matchPath ? matchPath : path}/*`.slice(1);
      return {
        path: routePath,
        ...other,
      };
    });
};

export const parseMenuItems = (
  routes: UI.RouteItem[],
  onClick?: UI.RouteItemClickHandler | undefined,
  showIcon?: boolean | undefined,
) => {
  return routes
    .filter(filterItem)
    .map((route) => parseMenuItem(route, onClick, showIcon));
};

export const isRouteActive = (route: UI.RouteItem, location: Location): boolean => {
  return !!matchPath(`${route.path}/*`, location.pathname);
};
