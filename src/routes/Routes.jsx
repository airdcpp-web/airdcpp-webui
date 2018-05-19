import React from 'react';
import { Route } from 'react-router-dom';

import AsyncComponentDecorator from 'decorators/AsyncComponentDecorator';
import RouterMenuItemLink from 'components/semantic/RouterMenuItemLink';

import HubSessionStore from 'stores/HubSessionStore';
import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';
import FilelistSessionStore from 'stores/FilelistSessionStore';
import ViewFileStore from 'stores/ViewFileStore';
import EventStore from 'stores/EventStore';

import LoginActions from 'actions/LoginActions';
import LoginStore from 'stores/LoginStore';
import AccessConstants from 'constants/AccessConstants';
import IconConstants from 'constants/IconConstants';


export const mainRoutes = [
  {
    title: 'Home',
    path: '/',
    matchPath: '/(home/widget)?',
    icon: IconConstants.HOME,
    exact: true,
    component: AsyncComponentDecorator(() => import(/* webpackChunkName: "home" */ 'routes/Home/components/Home')),
  }, {
    title: 'Queue',
    path: '/queue',
    icon: IconConstants.QUEUE,
    access: AccessConstants.QUEUE_VIEW,
    component: AsyncComponentDecorator(() => import(/* webpackChunkName: "queue" */ 'routes/Queue/components/Queue')),
  }, {
    title: 'Search',
    path: '/search',
    icon: IconConstants.SEARCH,
    access: AccessConstants.SEARCH,
    component: AsyncComponentDecorator(() => import(/* webpackChunkName: "search" */ 'routes/Search/components/Search')),
  }, {
    title: 'Transfers',
    path: '/transfers',
    icon: IconConstants.TRANSFERS,
    access: AccessConstants.TRANSFERS,
    component: AsyncComponentDecorator(() => import(/* webpackChunkName: "transfers" */ 'routes/Transfers/components/Transfers')),
  }
];

export const configRoutes = [
  {
    title: 'Favorite hubs',
    path: '/favorite-hubs',
    icon: IconConstants.FAVORITE,
    access: AccessConstants.FAVORITE_HUBS_VIEW,
    component: AsyncComponentDecorator(() => import(/* webpackChunkName: "favorite-hubs" */ 'routes/FavoriteHubs/components/FavoriteHubs')),
  }, {
    title: 'Share',
    path: '/share',
    icon: IconConstants.FOLDER,
    access: AccessConstants.SETTINGS_VIEW,
    component: AsyncComponentDecorator(() => import(/* webpackChunkName: "share" */ 'routes/Share/components/Share')),
  }, {
    title: 'Settings',
    path: '/settings',
    icon: IconConstants.SETTINGS,
    access: AccessConstants.SETTINGS_VIEW,
    component: AsyncComponentDecorator(() => import(/* webpackChunkName: "settings" */ 'routes/Settings/components/Settings')),
  }
];

export const secondaryRoutes = [
  {
    title: 'Hubs',
    path: '/hubs',
    matchPath: '/hubs/:session?/:id?',
    icon: 'blue sitemap',
    unreadInfoStore: HubSessionStore,
    access: AccessConstants.HUBS_VIEW,
    component: AsyncComponentDecorator(() => import(/* webpackChunkName: "hubs" */ 'routes/Sidebar/routes/Hubs/components/Hubs')),
  }, {
    title: 'Messages',
    path: '/messages',
    matchPath: '/messages/:session?/:id?',
    icon: 'blue comments',
    unreadInfoStore: PrivateChatSessionStore,
    access: AccessConstants.PRIVATE_CHAT_VIEW,
    component: AsyncComponentDecorator(() => import(/* webpackChunkName: "messages" */ 'routes/Sidebar/routes/Messages/components/Messages')),
  }, {
    title: 'Filelists',
    path: '/filelists',
    matchPath: '/filelists/:session?/:id?',
    icon: 'blue browser',
    unreadInfoStore: FilelistSessionStore,
    access: AccessConstants.FILELISTS_VIEW,
    component: AsyncComponentDecorator(() => import(/* webpackChunkName: "filelists" */ 'routes/Sidebar/routes/Filelists/components/Filelists')),
  }, {
    title: 'Files',
    path: '/files',
    matchPath: '/files/:session?/:id?',
    icon: 'blue file',
    unreadInfoStore: ViewFileStore,
    access: AccessConstants.VIEW_FILE_VIEW,
    component: AsyncComponentDecorator(() => import(/* webpackChunkName: "files" */ 'routes/Sidebar/routes/Files/components/Files')),
  }, {
    title: 'Events',
    path: '/events',
    icon: 'blue history',
    unreadInfoStore: EventStore,
    access: AccessConstants.EVENTS_VIEW,
    component: AsyncComponentDecorator(() => import(/* webpackChunkName: "system-log" */ 'routes/Sidebar/routes/Events/components/SystemLog')),
  }
];

const onClickLogout = (item, e) => {
  e.preventDefault();
  LoginActions.logout();
};

export const logoutItem = { 
  icon: 'sign out', 
  path: 'logout', 
  title: 'Logout',
  className: 'logout', 
  onClick: onClickLogout,
};

export const parseMenuItem = (route, onClick, showIcon = true) => {
  const { title, icon, unreadInfoStore, path, className } = route;
  return (
    <RouterMenuItemLink 
      key={ path }
      url={ path }
      className={ className }
      icon={ showIcon ? (icon + ' navigation') : null }
      onClick={ onClick || route.onClick ? (evt => onClick ? onClick(path, evt) : route.onClick(path, evt)) : undefined }
      unreadInfoStore={ unreadInfoStore }
    >
      { title }
    </RouterMenuItemLink>
  );
};

const filterItem = item => !item.access || LoginStore.hasAccess(item.access);

export const parseRoutes = (routes, location) => {
  return routes.map((route, i) => (
    <Route 
      key={ route.path } 
      { ...route } 
      path={ route.matchPath ? route.matchPath : route.path }
      location={ location }
    />
  ));
};

export const parseMenuItems = (routes, onClick, showIcon) => {
  return routes
    .filter(filterItem)
    .map(route => parseMenuItem(route, onClick, showIcon));
};
