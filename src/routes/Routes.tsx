import * as React from 'react';
import { Route, matchPath } from 'react-router-dom';

import { default as lazy } from 'decorators/AsyncComponentDecorator';
import RouterMenuItemLink from 'components/semantic/RouterMenuItemLink';

import HubSessionStore from 'stores/HubSessionStore';
import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';
import FilelistSessionStore from 'stores/FilelistSessionStore';
import ViewFileStore from 'stores/ViewFileStore';
import EventStore from 'stores/EventStore';

import LoginActions from 'actions/reflux/LoginActions';
import LoginStore from 'stores/LoginStore';
import IconConstants from 'constants/IconConstants';
import { Location } from 'history';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { Trans } from 'react-i18next';
import { textToI18nKey } from 'utils/TranslationUtils';

export type RouteItemClickHandler = (
  path: string,
  event: React.SyntheticEvent<any>
) => void;

export interface RouteItem {
  title: string;
  path: string;
  matchPath?: string;
  icon: string;
  unreadInfoStore?: any;
  access?: string;
  component?: React.ComponentType;
  className?: string;
  onClick?: RouteItemClickHandler;
}

export const HOME_URL = '/home';

export const mainRoutes: RouteItem[] = [
  {
    title: 'Home',
    path: HOME_URL,
    icon: IconConstants.HOME,
    component: lazy(() => import(/* webpackChunkName: "home" */ 'routes/Home')),
  },
  {
    title: 'Queue',
    path: '/queue',
    icon: IconConstants.QUEUE_COLORED,
    access: API.AccessEnum.QUEUE_VIEW,
    component: lazy(() => import(/* webpackChunkName: "queue" */ 'routes/Queue')),
  },
  {
    title: 'Search',
    path: '/search',
    icon: IconConstants.SEARCH,
    access: API.AccessEnum.SEARCH,
    component: lazy(() => import(/* webpackChunkName: "search" */ 'routes/Search')),
  },
  {
    title: 'Transfers',
    path: '/transfers',
    icon: IconConstants.TRANSFERS_COLORED,
    access: API.AccessEnum.TRANSFERS,
    component: lazy(() => import(/* webpackChunkName: "transfers" */ 'routes/Transfers')),
  },
];

export const configRoutes = [
  {
    title: 'Favorite hubs',
    path: '/favorite-hubs',
    icon: IconConstants.FAVORITE,
    access: API.AccessEnum.FAVORITE_HUBS_VIEW,
    component: lazy(
      () => import(/* webpackChunkName: "favorite-hubs" */ 'routes/FavoriteHubs')
    ),
  },
  {
    title: 'Share',
    path: '/share',
    icon: IconConstants.FOLDER,
    access: API.AccessEnum.SETTINGS_VIEW,
    component: lazy(() => import(/* webpackChunkName: "share" */ 'routes/Share')),
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: IconConstants.SETTINGS,
    access: API.AccessEnum.SETTINGS_VIEW,
    component: lazy(() => import(/* webpackChunkName: "settings" */ 'routes/Settings')),
  },
];

export const secondaryRoutes = [
  {
    title: 'Hubs',
    path: '/hubs',
    matchPath: '/hubs/:session?/:id?',
    icon: IconConstants.HUBS_COLORED,
    unreadInfoStore: HubSessionStore,
    access: API.AccessEnum.HUBS_VIEW,
    component: lazy(
      () => import(/* webpackChunkName: "hubs" */ 'routes/Sidebar/routes/Hubs')
    ),
  },
  {
    title: 'Messages',
    path: '/messages',
    matchPath: '/messages/:session?/:id?',
    icon: IconConstants.MESSAGES_COLORED,
    unreadInfoStore: PrivateChatSessionStore,
    access: API.AccessEnum.PRIVATE_CHAT_VIEW,
    component: lazy(
      () => import(/* webpackChunkName: "messages" */ 'routes/Sidebar/routes/Messages')
    ),
  },
  {
    title: 'Filelists',
    path: '/filelists',
    matchPath: '/filelists/:session?/:id?',
    icon: IconConstants.FILELISTS_COLORED,
    unreadInfoStore: FilelistSessionStore,
    access: API.AccessEnum.FILELISTS_VIEW,
    component: lazy(
      () => import(/* webpackChunkName: "filelists" */ 'routes/Sidebar/routes/Filelists')
    ),
  },
  {
    title: 'Files',
    path: '/files',
    matchPath: '/files/:session?/:id?',
    icon: IconConstants.FILES_COLORED,
    unreadInfoStore: ViewFileStore,
    access: API.AccessEnum.VIEW_FILE_VIEW,
    component: lazy(
      () => import(/* webpackChunkName: "files" */ 'routes/Sidebar/routes/Files')
    ),
  },
  {
    title: 'Events',
    path: '/events',
    icon: IconConstants.EVENTS_COLORED,
    unreadInfoStore: EventStore,
    access: API.AccessEnum.EVENTS_VIEW,
    component: lazy(
      () => import(/* webpackChunkName: "system-log" */ 'routes/Sidebar/routes/Events')
    ),
  },
];

const onClickLogout: RouteItemClickHandler = (path, e) => {
  e.preventDefault();
  LoginActions.logout();
};

export const logoutItem: RouteItem = {
  icon: IconConstants.LOGOUT,
  path: 'logout',
  title: 'Logout',
  className: 'logout',
  onClick: onClickLogout,
};

const menuItemClickHandler = (
  onClick: RouteItemClickHandler | undefined,
  route: RouteItem
) => {
  if (!!onClick || !!route.onClick) {
    return (evt: any) =>
      onClick ? onClick(route.path, evt) : route.onClick!(route.path, evt);
  }

  return undefined;
};

export const parseMenuItem = (
  route: RouteItem,
  onClick: RouteItemClickHandler | undefined = undefined,
  showIcon: boolean | undefined = true
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

const filterItem = (item: RouteItem) => !item.access || LoginStore.hasAccess(item.access);

export const parseRoutes = (routes: RouteItem[], location?: Location) => {
  return routes.map((route, i) => (
    <Route
      key={route.path}
      {...route}
      path={route.matchPath ? route.matchPath : route.path}
      location={location}
    />
  ));
};

export const parseMenuItems = (
  routes: RouteItem[],
  onClick?: RouteItemClickHandler | undefined,
  showIcon?: boolean | undefined
) => {
  return routes
    .filter(filterItem)
    .map((route) => parseMenuItem(route, onClick, showIcon));
};

export const isRouteActive = (route: RouteItem, location: Location): boolean => {
  return !!matchPath(location.pathname, {
    path: route.path,
  });
};
