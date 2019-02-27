'use strict';
//@ts-ignore
import Reflux from 'reflux';
import HubConstants from 'constants/HubConstants';
import SocketService from 'services/SocketService';

import History from 'utils/History';
import NotificationActions from 'actions/NotificationActions';

import ChatActionDecorator from './decorators/ChatActionDecorator';
import SessionActionDecorator from './decorators/SessionActionDecorator';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { ErrorResponse } from 'airdcpp-apisocket';
import { Location } from 'history';


const HubActionConfig: UI.RefluxActionConfigList<API.Hub> = [
  { 'createSession': { 
    asyncResult: true,
    access: API.AccessEnum.HUBS_EDIT, 
  } },
  { 'redirect': { 
    asyncResult: true,
    access: API.AccessEnum.HUBS_EDIT,
  } },
  { 'password': { 
    asyncResult: true,
    access: API.AccessEnum.HUBS_EDIT,
  } },
];

const HubActions = Reflux.createActions(HubActionConfig);

HubActions.password.listen(function (
  this: UI.AsyncActionType<API.Hub>, 
  hub: API.Hub, 
  password: string
) {
  let that = this;
  SocketService.post(`${HubConstants.SESSIONS_URL}/${hub.id}/password`, { password: password })
    .then(that.completed.bind(that, hub))
    .catch(that.failed.bind(that, hub));
});

HubActions.redirect.listen(function (this: UI.AsyncActionType<API.Hub>, hub: API.Hub) {
  let that = this;
  SocketService.post(`${HubConstants.SESSIONS_URL}/${hub.id}/redirect`)
    .then(that.completed.bind(that, hub))
    .catch(that.failed.bind(that, hub));
});

HubActions.createSession.listen(function (
  this: UI.AsyncActionType<API.Hub>,
  location: Location, 
  hubUrl: string, 
  sessionStore: any
) {
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

HubActions.createSession.completed.listen(function (location: Location, session: API.Hub) {
  History.push({
    pathname: `/hubs/session/${session.id}`, 
    state: {
      pending: true
    },
  });
});

HubActions.createSession.failed.listen(function (error: ErrorResponse) {
  NotificationActions.apiError('Failed to create hub session', error);
});

const HubActionsDecorated = SessionActionDecorator(
  ChatActionDecorator(
    HubActions, 
    HubConstants.SESSIONS_URL
  ), 
  HubConstants.SESSIONS_URL
);

//export default {
//  moduleId: UI.Modules.HUBS,
//  actions: HubActionsDecorated,
//};

export default HubActionsDecorated as UI.RefluxActionListType<void>;
