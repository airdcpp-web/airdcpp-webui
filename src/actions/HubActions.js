'use strict';
import Reflux from 'reflux';
import HubConstants from 'constants/HubConstants';
import SocketService from 'services/SocketService';

import History from 'utils/History';
import NotificationActions from 'actions/NotificationActions';

import ChatActionDecorator from './decorators/ChatActionDecorator';
import SessionActionDecorator from './decorators/SessionActionDecorator';

import IconConstants from 'constants/IconConstants';
import AccessConstants from 'constants/AccessConstants';


const showFav = hub => !hub.favorite_hub;

const HubActions = Reflux.createActions([
  { 'createSession': { 
    asyncResult: true,
    access: AccessConstants.HUBS_EDIT, 
  } },
  { 'redirect': { 
    asyncResult: true,
    access: AccessConstants.HUBS_EDIT,
  } },
  { 'password': { 
    asyncResult: true,
    access: AccessConstants.HUBS_EDIT,
  } },
  { 'reconnect': { 
    asyncResult: true,
    displayName: 'Reconnect',
    access: AccessConstants.HUBS_EDIT, 
    icon: IconConstants.REFRESH,
  } },
  { 'favorite': { 
    asyncResult: true,
    access: AccessConstants.HUBS_EDIT, 
    displayName: 'Add to favorites', 
    icon: IconConstants.FAVORITE,
    filter: showFav,
  } },
]);

HubActions.password.listen(function (hub, password) {
  let that = this;
  SocketService.post(HubConstants.SESSIONS_URL + '/' + hub.id + '/password', { password: password })
    .then(that.completed.bind(that, hub))
    .catch(that.failed.bind(that, hub));
});

HubActions.redirect.listen(function (hub) {
  let that = this;
  SocketService.post(HubConstants.SESSIONS_URL + '/' + hub.id + '/redirect')
    .then(that.completed.bind(that, hub))
    .catch(that.failed.bind(that, hub));
});

HubActions.favorite.listen(function (hub) {
  let that = this;
  SocketService.post(HubConstants.SESSIONS_URL + '/' + hub.id + '/favorite')
    .then(that.completed.bind(that, hub))
    .catch(that.failed.bind(that, hub));
});

HubActions.favorite.completed.listen(function (hub) {
  NotificationActions.success({ 
    title: hub.identity.name,
    message: 'The hub has been added in favorites',
  });		
});

HubActions.favorite.failed.listen(function (hub, error) {
  NotificationActions.error({ 
    title: hub.identity.name,
    message: error.message,
  });		
});

HubActions.reconnect.listen(function (hub) {
  let that = this;
  SocketService.post(HubConstants.SESSIONS_URL + '/' + hub.id + '/reconnect')
    .then(that.completed)
    .catch(this.failed);
});

HubActions.createSession.listen(function (location, hubUrl, sessionStore) {
  const session = sessionStore.getSessionByUrl(hubUrl);
  if (session) {
    this.completed(location, session);
    return;
  }

  let that = this;
  SocketService.post(HubConstants.SESSIONS_URL, {
    hub_url: hubUrl,
  })
    .then(that.completed.bind(that, location))
    .catch(that.failed);
});

HubActions.createSession.completed.listen(function (location, session) {
  History.push({
    pathname: `/hubs/session/${session.id}`, 
    state: {
      pending: true
    },
  });
});

HubActions.createSession.failed.listen(function (error) {
  NotificationActions.apiError('Failed to create hub session', error);
});

export default SessionActionDecorator(
  ChatActionDecorator(HubActions, HubConstants.SESSIONS_URL, AccessConstants.HUBS_EDIT), HubConstants.SESSIONS_URL, AccessConstants.HUBS_EDIT
);
