import * as React from 'react';

import { default as lazy } from '@/decorators/AsyncComponentDecorator';
import RouterMenuItemLink from '@/components/semantic/RouterMenuItemLink';

import LoginActions from '@/actions/reflux/LoginActions';
import IconConstants from '@/constants/IconConstants';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { Trans } from 'react-i18next';
import { textToI18nKey } from '@/utils/TranslationUtils';
import { Route, matchPath, Location } from 'react-router';
import { APISocket } from '@/services/SocketService';

import { PrivateChatStoreSelector } from '@/stores/privateChatSessionSlice';
import { HubStoreSelector } from '@/stores/hubSessionSlice';
import { EventStoreSelector } from '@/stores/eventSlice';
import { FilelistStoreSelector } from '@/stores/filelistSlice';
import { ViewFileStoreSelector } from '@/stores/viewFileSlice';

export type RouteItemClickHandler = (
  path: string,
  event: React.SyntheticEvent<any>,
) => void;

export interface RouteItem {
  title: string;
  path: string;
  matchPath?: string;
  icon: string;
  unreadInfoStoreSelector?: UI.UnreadInfoStoreSelector;
  access?: API.AccessEnum;
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
    component: lazy(() => import(/* webpackChunkName: "home" */ '@/routes/Home')),
  },
  {
    title: 'Queue',
    path: '/queue',
    icon: IconConstants.QUEUE_COLORED,
    access: API.AccessEnum.QUEUE_VIEW,
    component: lazy(() => import(/* webpackChunkName: "queue" */ '@/routes/Queue')),
  },
  {
    title: 'Search',
    path: '/search',
    icon: IconConstants.SEARCH,
    access: API.AccessEnum.SEARCH,
    component: lazy(() => import(/* webpackChunkName: "search" */ '@/routes/Search')),
  },
  {
    title: 'Transfers',
    path: '/transfers',
    icon: IconConstants.TRANSFERS_COLORED,
    access: API.AccessEnum.TRANSFERS,
    component: lazy(
      () => import(/* webpackChunkName: "transfers" */ '@/routes/Transfers'),
    ),
  },
];

export const configRoutes = [
  {
    title: 'Favorite hubs',
    path: '/favorite-hubs',
    icon: IconConstants.FAVORITE,
    access: API.AccessEnum.FAVORITE_HUBS_VIEW,
    component: lazy(
      () => import(/* webpackChunkName: "favorite-hubs" */ '@/routes/FavoriteHubs'),
    ),
  },
  {
    title: 'Share',
    path: '/share',
    icon: IconConstants.FOLDER,
    access: API.AccessEnum.SETTINGS_VIEW,
    component: lazy(() => import(/* webpackChunkName: "share" */ '@/routes/Share')),
  },
  {
    title: 'Settings',
    path: '/settings',
    // matchPath: '/settings/:mainSection?/:childSection?',
    icon: IconConstants.SETTINGS,
    access: API.AccessEnum.SETTINGS_VIEW,
    component: lazy(() => import(/* webpackChunkName: "settings" */ '@/routes/Settings')),
  },
];

export const secondaryRoutes: RouteItem[] = [
  {
    title: 'Hubs',
    path: '/hubs',
    matchPath: '/hubs/:session?/:id?',
    icon: IconConstants.HUBS_COLORED,
    unreadInfoStoreSelector: HubStoreSelector,
    access: API.AccessEnum.HUBS_VIEW,
    component: lazy(
      () => import(/* webpackChunkName: "hubs" */ '@/routes/Sidebar/routes/Hubs'),
    ),
  },
  {
    title: 'Messages',
    path: '/messages',
    matchPath: '/messages/:session?/:id?',
    icon: IconConstants.MESSAGES_COLORED,
    unreadInfoStoreSelector: PrivateChatStoreSelector,
    access: API.AccessEnum.PRIVATE_CHAT_VIEW,
    component: lazy(
      () => import(/* webpackChunkName: "messages" */ '@/routes/Sidebar/routes/Messages'),
    ),
  },
  {
    title: 'Filelists',
    path: '/filelists',
    matchPath: '/filelists/:session?/:id?',
    icon: IconConstants.FILELISTS_COLORED,
    unreadInfoStoreSelector: FilelistStoreSelector,
    access: API.AccessEnum.FILELISTS_VIEW,
    component: lazy(
      () =>
        import(/* webpackChunkName: "filelists" */ '@/routes/Sidebar/routes/Filelists'),
    ),
  },
  {
    title: 'Files',
    path: '/files',
    matchPath: '/files/:session?/:id?',
    icon: IconConstants.FILES_COLORED,
    unreadInfoStoreSelector: ViewFileStoreSelector,
    access: API.AccessEnum.VIEW_FILE_VIEW,
    component: lazy(
      () => import(/* webpackChunkName: "files" */ '@/routes/Sidebar/routes/Files'),
    ),
  },
  {
    title: 'Events',
    path: '/events',
    icon: IconConstants.EVENTS_COLORED,
    unreadInfoStoreSelector: EventStoreSelector,
    access: API.AccessEnum.EVENTS_VIEW,
    component: lazy(
      () => import(/* webpackChunkName: "system-log" */ '@/routes/Sidebar/routes/Events'),
    ),
  },
];

export const getLogoutItem = (socket: APISocket): RouteItem => ({
  icon: IconConstants.LOGOUT,
  path: 'logout',
  title: 'Logout',
  className: 'logout',
  onClick: (path, e) => {
    e.preventDefault();
    LoginActions.logout(socket);
  },
});

const menuItemClickHandler = (
  onClick: RouteItemClickHandler | undefined,
  route: RouteItem,
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
  showIcon: boolean | undefined = true,
) => {
  const { title, icon, unreadInfoStoreSelector, path, className } = route;
  return (
    <RouterMenuItemLink
      key={path}
      url={path}
      className={className}
      icon={showIcon ? icon + ' navigation' : null}
      onClick={menuItemClickHandler(onClick, route)}
      unreadInfoStoreSelector={unreadInfoStoreSelector}
    >
      <Trans i18nKey={textToI18nKey(title, UI.SubNamespaces.NAVIGATION)}>{title}</Trans>
    </RouterMenuItemLink>
  );
};

const filterItem = (item: RouteItem, { hasAccess }: UI.AuthenticatedSession) =>
  !item.access || hasAccess(item.access);

export const parseRoutes = (routes: RouteItem[]) => {
  return routes.map((route, i) => {
    const { component: Component, ...other } = route;
    return (
      <Route
        key={route.path}
        {...other}
        path={`${route.matchPath ? route.matchPath : route.path}/*`}
        element={!!Component && <Component />}
      />
    );
  });
};

export const parseMenuItems = (
  routes: RouteItem[],
  session: UI.AuthenticatedSession,
  onClick?: RouteItemClickHandler | undefined,
  showIcon?: boolean | undefined,
) => {
  return routes
    .filter((route) => filterItem(route, session))
    .map((route) => parseMenuItem(route, onClick, showIcon));
};

export const isRouteActive = (route: RouteItem, location: Location): boolean => {
  return !!matchPath(`${route.path}/*`, location.pathname);
};
